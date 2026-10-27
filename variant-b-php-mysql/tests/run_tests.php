<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Core/Database.php';
require_once __DIR__ . '/../src/Services/AccountingService.php';
require_once __DIR__ . '/../src/Services/InventoryService.php';
require_once __DIR__ . '/../src/Services/HrmService.php';
require_once __DIR__ . '/../src/Services/CrmService.php';

use App\Core\Database;
use App\Services\AccountingService;
use App\Services\InventoryService;
use App\Services\HrmService;
use App\Services\CrmService;

$passed = 0;
$failed = 0;

function assertCondition(bool $cond, string $name): void {
    global $passed, $failed;
    if ($cond) {
        echo "  [PASS] {$name}\n";
        $passed++;
    } else {
        echo "  [FAIL] {$name}\n";
        $failed++;
    }
}

echo "========================================================\n";
echo "DREAMS ERP - VARIANT B AUTOMATED ACCEPTANCE TEST SUITE\n";
echo "========================================================\n\n";

$pdo = Database::getConnection();
$orgId = 'org-falcon-llp-001';

// TEST 1: Double-Entry Financial Invariant & Sales-to-Cash
echo "TEST SUITE 1: Double-Entry Accounting & Sales-to-Cash Lifecycle\n";
$acc = new AccountingService($pdo);

$invRes = $acc->createInvoice($orgId, [
    'customer_name' => 'Acme Corporation',
    'total_amount' => 1200.00,
    'invoice_number' => '#INV-TEST-001'
]);
assertCondition(!empty($invRes['id']), "Invoice #INV-TEST-001 created successfully");

$payRes = $acc->recordPayment($orgId, $invRes['id'], 1200.00, 'Bank Transfer');
assertCondition($payRes['invoice_status'] === 'Paid', "Invoice status transitioned to 'Paid' after full settlement");

$balanceCheck = $acc->verifyGlBalance($orgId);
assertCondition($balanceCheck['is_balanced'] === true, "General Ledger strictly balanced: SUM(Debit) == SUM(Credit) (Diff: {$balanceCheck['difference']})");
echo "\n";

// TEST 2: Procure-to-Stock & Traceable Stock Ledger
echo "TEST SUITE 2: Procure-to-Stock & Immutable Inventory Ledger\n";
$inv = new InventoryService($pdo);

$initialQty = (int)$pdo->query("SELECT quantity FROM products WHERE id = 'prd-020'")->fetchColumn();
$recRes = $inv->receiveGoods($orgId, 'po-020', 'wrh-020');
$afterQty = (int)$pdo->query("SELECT quantity FROM products WHERE id = 'prd-020'")->fetchColumn();

assertCondition($afterQty === $initialQty + 10, "Stock quantity incremented by exactly +10 (Before: {$initialQty}, After: {$afterQty})");
assertCondition(!empty($recRes['stock_ledger_id']), "Immutable stock ledger entry logged (ID: {$recRes['stock_ledger_id']})");
echo "\n";

// TEST 3: HRMS Leave Application & Atomic Approval
echo "TEST SUITE 3: HRMS Leave Application & Balance Deduction\n";
$hrm = new HrmService($pdo);

$empBefore = $pdo->query("SELECT leave_balance FROM employees WHERE id = 'emp-001'")->fetch();
$balBefore = (float)$empBefore['leave_balance'];

$leaveApp = $hrm->applyLeave($orgId, 'emp-001', 'Annual', '2026-12-01', '2026-12-03', 3.0, 'Family holiday');
assertCondition($leaveApp['status'] === 'Pending', "Leave application created with 'Pending' status");

$approval = $hrm->approveLeave($orgId, $leaveApp['id'], 'usr-admin-jamie');
assertCondition($approval['status'] === 'Approved', "Leave request approved by authorized manager");

$empAfter = $pdo->query("SELECT leave_balance FROM employees WHERE id = 'emp-001'")->fetch();
$balAfter = (float)$empAfter['leave_balance'];
assertCondition($balAfter === $balBefore - 3.0, "Leave balance atomically decremented by 3.0 days (Before: {$balBefore}, After: {$balAfter})");
echo "\n";

// TEST 4: CRM Deal Chevron Pipeline & Audit Trail
echo "TEST SUITE 4: CRM Pipeline Chevron Stages & Stage Transitions\n";
$crm = new CrmService($pdo);

$stageRes = $crm->advanceDealStage($orgId, 'del-020', 'Won');
assertCondition($stageRes['stage'] === 'Won', "Deal advanced to 'Won'");
assertCondition($stageRes['probability'] === 100, "Probability automatically updated to 100% on Won");

$auditCount = $pdo->query("SELECT COUNT(*) FROM audit_logs WHERE entity_id = 'del-020' AND action = 'stage_change'")->fetchColumn();
assertCondition((int)$auditCount > 0, "Audit log appended for deal stage change event");
echo "\n";

// SUMMARY
echo "========================================================\n";
echo "TEST RUN SUMMARY: Total Tests: " . ($passed + $failed) . " | Passed: {$passed} | Failed: {$failed}\n";
echo "========================================================\n";

if ($failed > 0) {
    exit(1);
}
