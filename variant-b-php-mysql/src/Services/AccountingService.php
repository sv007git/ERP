<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use PDO;
use Exception;
use InvalidArgumentException;

class AccountingService
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Database::getConnection();
    }

    public function createInvoice(string $orgId, array $data): array
    {
        $customerName = trim($data['customer_name'] ?? '');
        $totalAmount = (float)($data['total_amount'] ?? 0.00);

        if (empty($customerName)) {
            throw new InvalidArgumentException("Customer name is required.");
        }
        if ($totalAmount <= 0) {
            throw new InvalidArgumentException("Total amount must be greater than zero.");
        }

        $invId = 'inv-' . bin2hex(random_bytes(6));
        $invNumber = $data['invoice_number'] ?? ('#INV' . rand(1000, 9999));
        $invoiceDate = $data['invoice_date'] ?? date('Y-m-d');
        $dueDate = $data['due_date'] ?? date('Y-m-d', strtotime('+30 days'));

        $this->pdo->beginTransaction();
        try {
            // Insert Invoice
            $stmt = $this->pdo->prepare("
                INSERT INTO invoices (id, organization_id, invoice_number, customer_name, customer_email, invoice_date, due_date, subtotal, tax_amount, total_amount, paid_amount, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00, 'Pending')
            ");
            $stmt->execute([
                $invId,
                $orgId,
                $invNumber,
                $customerName,
                $data['customer_email'] ?? null,
                $invoiceDate,
                $dueDate,
                $totalAmount,
                0.00,
                $totalAmount
            ]);

            // Post Balancing Double-Entry GL entries:
            // Debit: Accounts Receivable (1200)
            // Credit: Sales Revenue (4010)
            $this->postGlEntry($orgId, $invoiceDate, 'coa-1200', $totalAmount, 0.00, 'Invoice', $invId, "Invoice {$invNumber}");
            $this->postGlEntry($orgId, $invoiceDate, 'coa-4010', 0.00, $totalAmount, 'Invoice', $invId, "Revenue for {$invNumber}");

            $this->pdo->commit();

            return [
                'id' => $invId,
                'invoice_number' => $invNumber,
                'total_amount' => $totalAmount,
                'status' => 'Pending'
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function recordPayment(string $orgId, string $invoiceId, float $amount, string $method = 'Bank Transfer'): array
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException("Payment amount must be greater than zero.");
        }

        $this->pdo->beginTransaction();
        try {
            // Find invoice
            $stmt = $this->pdo->prepare("SELECT * FROM invoices WHERE id = ? AND organization_id = ?");
            $stmt->execute([$invoiceId, $orgId]);
            $invoice = $stmt->fetch();
            if (!$invoice) {
                throw new InvalidArgumentException("Invoice not found.");
            }

            $newPaid = (float)$invoice['paid_amount'] + $amount;
            $newStatus = ($newPaid >= (float)$invoice['total_amount']) ? 'Paid' : 'Partially Paid';

            // Update invoice
            $update = $this->pdo->prepare("UPDATE invoices SET paid_amount = ?, status = ? WHERE id = ?");
            $update->execute([$newPaid, $newStatus, $invoiceId]);

            // Insert payment record
            $payId = 'pay-' . bin2hex(random_bytes(6));
            $payNumber = '#PAY' . rand(1000, 9999);
            $payDate = date('Y-m-d');

            $stmtPay = $this->pdo->prepare("
                INSERT INTO payments (id, organization_id, payment_number, payment_type, party_name, amount, payment_method, payment_date, invoice_id, status)
                VALUES (?, ?, ?, 'Receive', ?, ?, ?, ?, ?, 'Paid')
            ");
            $stmtPay->execute([$payId, $orgId, $payNumber, $invoice['customer_name'], $amount, $method, $payDate, $invoiceId]);

            // Post Balancing Double-Entry GL entries:
            // Debit: Cash at Bank (1010)
            // Credit: Accounts Receivable (1200)
            $this->postGlEntry($orgId, $payDate, 'coa-1010', $amount, 0.00, 'Payment', $payId, "Payment {$payNumber} for invoice {$invoice['invoice_number']}");
            $this->postGlEntry($orgId, $payDate, 'coa-1200', 0.00, $amount, 'Payment', $payId, "Settlement for invoice {$invoice['invoice_number']}");

            $this->pdo->commit();

            return [
                'payment_id' => $payId,
                'payment_number' => $payNumber,
                'amount' => $amount,
                'invoice_status' => $newStatus
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function verifyGlBalance(string $orgId): array
    {
        $stmt = $this->pdo->prepare("
            SELECT 
                ROUND(COALESCE(SUM(debit), 0.0), 2) as total_debit, 
                ROUND(COALESCE(SUM(credit), 0.0), 2) as total_credit 
            FROM gl_entries 
            WHERE organization_id = ?
        ");
        $stmt->execute([$orgId]);
        $row = $stmt->fetch();

        $debit = (float)$row['total_debit'];
        $credit = (float)$row['total_credit'];
        $isBalanced = abs($debit - $credit) < 0.001;

        return [
            'total_debit' => $debit,
            'total_credit' => $credit,
            'difference' => round($debit - $credit, 2),
            'is_balanced' => $isBalanced
        ];
    }

    public function getTrialBalance(string $orgId): array
    {
        $stmt = $this->pdo->prepare("
            SELECT 
                c.account_code, 
                c.account_name, 
                c.account_type,
                ROUND(COALESCE(SUM(g.debit), 0.0), 2) as debit_total,
                ROUND(COALESCE(SUM(g.credit), 0.0), 2) as credit_total
            FROM chart_of_accounts c
            LEFT JOIN gl_entries g ON g.account_id = c.id AND g.organization_id = c.organization_id
            WHERE c.organization_id = ?
            GROUP BY c.id, c.account_code, c.account_name, c.account_type
            ORDER BY c.account_code ASC
        ");
        $stmt->execute([$orgId]);
        return $stmt->fetchAll();
    }

    private function postGlEntry(string $orgId, string $date, string $accId, float $debit, float $credit, string $vType, string $vId, string $remarks): void
    {
        $id = 'gl-' . bin2hex(random_bytes(6));
        $stmt = $this->pdo->prepare("
            INSERT INTO gl_entries (id, organization_id, posting_date, account_id, debit, credit, voucher_type, voucher_id, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$id, $orgId, $date, $accId, $debit, $credit, $vType, $vId, $remarks]);
    }
}
