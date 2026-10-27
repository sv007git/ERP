<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use PDO;
use Exception;
use InvalidArgumentException;

class InventoryService
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Database::getConnection();
    }

    public function receiveGoods(string $orgId, string $poId, string $warehouseId): array
    {
        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM purchase_orders WHERE id = ? AND organization_id = ?");
            $stmt->execute([$poId, $orgId]);
            $po = $stmt->fetch();
            if (!$po) {
                throw new InvalidArgumentException("Purchase order not found.");
            }

            // Find default product or first product for receipt
            $stmtProd = $this->pdo->prepare("SELECT id, name, purchase_price, quantity FROM products WHERE organization_id = ? ORDER BY created_at ASC LIMIT 1");
            $stmtProd->execute([$orgId]);
            $product = $stmtProd->fetch();
            if (!$product) {
                throw new InvalidArgumentException("No products found in organization catalog.");
            }

            $receivedQty = 10;
            $unitCost = (float)$product['purchase_price'];

            // 1. Update Product Quantity
            $newQty = (int)$product['quantity'] + $receivedQty;
            $stmtUpd = $this->pdo->prepare("UPDATE products SET quantity = ?, status = 'In Stock' WHERE id = ?");
            $stmtUpd->execute([$newQty, $product['id']]);

            // 2. Append Immutable Stock Ledger Entry
            $sleId = 'sle-' . bin2hex(random_bytes(6));
            $stmtSle = $this->pdo->prepare("
                INSERT INTO stock_ledger_entries (id, organization_id, product_id, warehouse_id, delta_qty, unit_cost, voucher_type, voucher_id)
                VALUES (?, ?, ?, ?, ?, ?, 'Goods Receipt', ?)
            ");
            $stmtSle->execute([$sleId, $orgId, $product['id'], $warehouseId, $receivedQty, $unitCost, $poId]);

            // 3. Update Purchase Order Status to 'Delivered'
            $stmtPo = $this->pdo->prepare("UPDATE purchase_orders SET status = 'Delivered' WHERE id = ?");
            $stmtPo->execute([$poId]);

            $this->pdo->commit();

            return [
                'purchase_order_id' => $poId,
                'product_id' => $product['id'],
                'product_name' => $product['name'],
                'delta_qty' => $receivedQty,
                'new_quantity' => $newQty,
                'stock_ledger_id' => $sleId
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function adjustStock(string $orgId, string $productId, string $warehouseId, int $deltaQty, float $unitCost, string $reason): array
    {
        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("SELECT quantity FROM products WHERE id = ? AND organization_id = ?");
            $stmt->execute([$productId, $orgId]);
            $prod = $stmt->fetch();
            if (!$prod) {
                throw new InvalidArgumentException("Product not found.");
            }

            $newQty = (int)$prod['quantity'] + $deltaQty;
            if ($newQty < 0) {
                throw new InvalidArgumentException("Stock quantity cannot be reduced below zero.");
            }

            $status = ($newQty === 0) ? 'Out of Stock' : 'In Stock';
            $update = $this->pdo->prepare("UPDATE products SET quantity = ?, status = ? WHERE id = ?");
            $update->execute([$newQty, $status, $productId]);

            $sleId = 'sle-' . bin2hex(random_bytes(6));
            $stmtSle = $this->pdo->prepare("
                INSERT INTO stock_ledger_entries (id, organization_id, product_id, warehouse_id, delta_qty, unit_cost, voucher_type, voucher_id)
                VALUES (?, ?, ?, ?, ?, ?, 'Adjustment', ?)
            ");
            $stmtSle->execute([$sleId, $orgId, $productId, $warehouseId, $deltaQty, $unitCost, $reason]);

            $this->pdo->commit();

            return [
                'product_id' => $productId,
                'new_quantity' => $newQty,
                'stock_ledger_id' => $sleId,
                'status' => $status
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}
