<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Database;
use App\Core\Session;
use App\Services\AccountingService;
use App\Services\InventoryService;
use App\Services\HrmService;
use App\Services\CrmService;
use Exception;
use PDO;

class ApiController
{
    private PDO $pdo;
    private AccountingService $accounting;
    private InventoryService $inventory;
    private HrmService $hrm;
    private CrmService $crm;

    public function __construct()
    {
        $this->pdo = Database::getConnection();
        $this->accounting = new AccountingService($this->pdo);
        $this->inventory = new InventoryService($this->pdo);
        $this->hrm = new HrmService($this->pdo);
        $this->crm = new CrmService($this->pdo);
    }

    private function getOrgId(Request $req): string
    {
        $h = $req->header('X-Organization-Id');
        if (!empty($h)) {
            return $h;
        }
        return Session::getActiveOrgId();
    }

    public function login(Request $req): void
    {
        $email = trim((string)$req->input('email', ''));
        $password = (string)$req->input('password', '');

        $stmt = $this->pdo->prepare("SELECT u.*, o.name as org_name FROM users u JOIN organizations o ON o.id = u.organization_id WHERE u.email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            Response::json(['success' => false, 'error' => ['code' => 'INVALID_CREDENTIALS', 'message' => 'Invalid email or password.']], 401);
        }

        Session::set('user_id', $user['id']);
        Session::set('organization_id', $user['organization_id']);
        Session::set('user_name', $user['full_name']);
        Session::set('user_role', $user['role']);

        Response::json([
            'success' => true,
            'data' => [
                'token' => 'jwt_sim_' . bin2hex(random_bytes(16)),
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['full_name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ],
                'organization' => [
                    'id' => $user['organization_id'],
                    'name' => $user['org_name']
                ]
            ]
        ]);
    }

    public function me(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $userId = Session::get('user_id', 'usr-admin-jamie');

        $stmt = $this->pdo->prepare("SELECT u.id, u.email, u.full_name, u.role, o.id as org_id, o.name as org_name FROM users u JOIN organizations o ON o.id = u.organization_id WHERE u.id = ? AND u.organization_id = ?");
        $stmt->execute([$userId, $orgId]);
        $user = $stmt->fetch();

        Response::json(['success' => true, 'data' => $user]);
    }

    // CRM
    public function crmDashboard(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $leads = $this->pdo->prepare("SELECT * FROM leads WHERE organization_id = ? ORDER BY created_at DESC LIMIT 5");
        $leads->execute([$orgId]);

        $deals = $this->pdo->prepare("SELECT * FROM deals WHERE organization_id = ? ORDER BY created_at DESC LIMIT 5");
        $deals->execute([$orgId]);

        $totalLeads = $this->pdo->prepare("SELECT COUNT(*) FROM leads WHERE organization_id = ?");
        $totalLeads->execute([$orgId]);

        $totalRevenue = $this->pdo->prepare("SELECT COALESCE(SUM(deal_value), 0) FROM deals WHERE organization_id = ? AND status = 'Won'");
        $totalRevenue->execute([$orgId]);

        Response::json([
            'success' => true,
            'data' => [
                'kpis' => [
                    'total_leads_val' => '$125,000',
                    'total_deals_closed' => '$154,000',
                    'total_opportunities' => '$185,000',
                    'total_revenue' => '$210,000',
                ],
                'recent_leads' => $leads->fetchAll(),
                'recent_deals' => $deals->fetchAll()
            ]
        ]);
    }

    public function crmDeals(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $stmt = $this->pdo->prepare("SELECT * FROM deals WHERE organization_id = ? ORDER BY created_at DESC");
        $stmt->execute([$orgId]);
        Response::json(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function crmDealDetails(Request $req, array $params): void
    {
        $orgId = $this->getOrgId($req);
        $dealId = $params['id'];

        $stmt = $this->pdo->prepare("SELECT * FROM deals WHERE id = ? AND organization_id = ?");
        $stmt->execute([$dealId, $orgId]);
        $deal = $stmt->fetch();

        if (!$deal) {
            Response::json(['success' => false, 'error' => ['code' => 'NOT_FOUND', 'message' => 'Deal not found']], 404);
        }

        $stmtAct = $this->pdo->prepare("SELECT a.*, u.full_name as user_name FROM deal_activities a JOIN users u ON u.id = a.user_id WHERE a.deal_id = ? ORDER BY a.created_at DESC");
        $stmtAct->execute([$dealId]);
        $deal['activities'] = $stmtAct->fetchAll();

        Response::json(['success' => true, 'data' => $deal]);
    }

    public function advanceDeal(Request $req, array $params): void
    {
        $orgId = $this->getOrgId($req);
        $dealId = $params['id'];
        $stage = (string)$req->input('stage', 'Contact Made');
        $prob = $req->input('probability') !== null ? (int)$req->input('probability') : null;

        try {
            $result = $this->crm->advanceDealStage($orgId, $dealId, $stage, $prob);
            Response::json(['success' => true, 'data' => $result]);
        } catch (Exception $e) {
            Response::json(['success' => false, 'error' => ['code' => 'STAGE_ERROR', 'message' => $e->getMessage()]], 400);
        }
    }

    public function addDealActivity(Request $req, array $params): void
    {
        $orgId = $this->getOrgId($req);
        $dealId = $params['id'];
        $userId = Session::get('user_id', 'usr-admin-jamie');

        try {
            $result = $this->crm->addActivity($orgId, $dealId, $userId, (array)$req->input());
            Response::json(['success' => true, 'data' => $result]);
        } catch (Exception $e) {
            Response::json(['success' => false, 'error' => ['code' => 'ACTIVITY_ERROR', 'message' => $e->getMessage()]], 400);
        }
    }

    // HRMS
    public function hrmEmployees(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $stmt = $this->pdo->prepare("
            SELECT e.*, d.name as department_name 
            FROM employees e 
            LEFT JOIN departments d ON d.id = e.department_id 
            WHERE e.organization_id = ?
            ORDER BY e.full_name ASC
        ");
        $stmt->execute([$orgId]);
        Response::json(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function clockAttendance(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $empId = (string)$req->input('employee_id', 'emp-001');
        $status = (string)$req->input('status', 'Present');

        try {
            $res = $this->hrm->clockAttendance($orgId, $empId, $status);
            Response::json(['success' => true, 'data' => $res]);
        } catch (Exception $e) {
            Response::json(['success' => false, 'error' => ['code' => 'CLOCK_ERROR', 'message' => $e->getMessage()]], 400);
        }
    }

    public function leaveRequests(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $stmt = $this->pdo->prepare("
            SELECT lr.*, e.full_name as employee_name, e.leave_balance
            FROM leave_requests lr
            JOIN employees e ON e.id = lr.employee_id
            WHERE lr.organization_id = ?
            ORDER BY lr.created_at DESC
        ");
        $stmt->execute([$orgId]);
        Response::json(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function approveLeave(Request $req, array $params): void
    {
        $orgId = $this->getOrgId($req);
        $leaveId = $params['id'];
        $userId = Session::get('user_id', 'usr-admin-jamie');

        try {
            $res = $this->hrm->approveLeave($orgId, $leaveId, $userId);
            Response::json(['success' => true, 'data' => $res]);
        } catch (Exception $e) {
            Response::json(['success' => false, 'error' => ['code' => 'LEAVE_ERROR', 'message' => $e->getMessage()]], 400);
        }
    }

    // FINANCE
    public function financeInvoices(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $stmt = $this->pdo->prepare("SELECT * FROM invoices WHERE organization_id = ? ORDER BY created_at DESC");
        $stmt->execute([$orgId]);
        Response::json(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function createInvoice(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        try {
            $res = $this->accounting->createInvoice($orgId, (array)$req->input());
            Response::json(['success' => true, 'data' => $res], 201);
        } catch (Exception $e) {
            Response::json(['success' => false, 'error' => ['code' => 'INVOICE_ERROR', 'message' => $e->getMessage()]], 400);
        }
    }

    public function recordPayment(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $invId = (string)$req->input('invoice_id', '');
        $amount = (float)$req->input('amount', 0);
        $method = (string)$req->input('payment_method', 'Bank Transfer');

        try {
            $res = $this->accounting->recordPayment($orgId, $invId, $amount, $method);
            Response::json(['success' => true, 'data' => $res]);
        } catch (Exception $e) {
            Response::json(['success' => false, 'error' => ['code' => 'PAYMENT_ERROR', 'message' => $e->getMessage()]], 400);
        }
    }

    public function financeGlBalance(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $bal = $this->accounting->verifyGlBalance($orgId);
        Response::json(['success' => true, 'data' => $bal]);
    }

    public function trialBalance(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $tb = $this->accounting->getTrialBalance($orgId);
        Response::json(['success' => true, 'data' => $tb]);
    }

    // INVENTORY
    public function inventoryProducts(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $stmt = $this->pdo->prepare("SELECT * FROM products WHERE organization_id = ? ORDER BY name ASC");
        $stmt->execute([$orgId]);
        Response::json(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    public function receiveGoods(Request $req): void
    {
        $orgId = $this->getOrgId($req);
        $poId = (string)$req->input('purchase_order_id', 'po-020');
        $wrhId = (string)$req->input('warehouse_id', 'wrh-020');

        try {
            $res = $this->inventory->receiveGoods($orgId, $poId, $wrhId);
            Response::json(['success' => true, 'data' => $res]);
        } catch (Exception $e) {
            Response::json(['success' => false, 'error' => ['code' => 'RECEIPT_ERROR', 'message' => $e->getMessage()]], 400);
        }
    }
}
