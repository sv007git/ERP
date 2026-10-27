<?php

declare(strict_types=1);

// Dreams ERP - Variant B Front Controller
require_once __DIR__ . '/../src/Core/Database.php';
require_once __DIR__ . '/../src/Core/Request.php';
require_once __DIR__ . '/../src/Core/Response.php';
require_once __DIR__ . '/../src/Core/Session.php';
require_once __DIR__ . '/../src/Core/Router.php';
require_once __DIR__ . '/../src/Services/AccountingService.php';
require_once __DIR__ . '/../src/Services/InventoryService.php';
require_once __DIR__ . '/../src/Services/HrmService.php';
require_once __DIR__ . '/../src/Services/CrmService.php';
require_once __DIR__ . '/../src/Controllers/ApiController.php';
require_once __DIR__ . '/../src/Controllers/WebController.php';

use App\Core\Request;
use App\Core\Response;
use App\Core\Router;
use App\Controllers\ApiController;
use App\Controllers\WebController;

// Enable CORS for frontend API calls
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Organization-Id');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$request = new Request();
$router = new Router();

// Web Routes
$router->get('/', [WebController::class, 'dashboard']);
$router->get('/deals', [WebController::class, 'dealsView']);

// API Routes
$router->post('/api/v1/auth/login', [ApiController::class, 'login']);
$router->get('/api/v1/auth/me', [ApiController::class, 'me']);

// CRM
$router->get('/api/v1/crm/dashboard', [ApiController::class, 'crmDashboard']);
$router->get('/api/v1/crm/deals', [ApiController::class, 'crmDeals']);
$router->get('/api/v1/crm/deals/{id}', [ApiController::class, 'crmDealDetails']);
$router->patch('/api/v1/crm/deals/{id}/stage', [ApiController::class, 'advanceDeal']);
$router->post('/api/v1/crm/deals/{id}/activities', [ApiController::class, 'addDealActivity']);

// HRMS
$router->get('/api/v1/hrm/employees', [ApiController::class, 'hrmEmployees']);
$router->post('/api/v1/hrm/attendance/clock', [ApiController::class, 'clockAttendance']);
$router->get('/api/v1/hrm/leave-requests', [ApiController::class, 'leaveRequests']);
$router->post('/api/v1/hrm/leave-requests/{id}/approve', [ApiController::class, 'approveLeave']);

// Finance & Accounting
$router->get('/api/v1/finance/invoices', [ApiController::class, 'financeInvoices']);
$router->post('/api/v1/finance/invoices/create', [ApiController::class, 'createInvoice']);
$router->post('/api/v1/finance/payments', [ApiController::class, 'recordPayment']);
$router->get('/api/v1/finance/reports/gl-balance', [ApiController::class, 'financeGlBalance']);
$router->get('/api/v1/finance/reports/trial-balance', [ApiController::class, 'trialBalance']);

// Inventory
$router->get('/api/v1/inventory/products', [ApiController::class, 'inventoryProducts']);
$router->post('/api/v1/inventory/receive', [ApiController::class, 'receiveGoods']);

// Health
$router->get('/api/health', function (Request $req) {
    Response::json(['status' => 'healthy', 'variant' => 'B', 'runtime' => 'PHP ' . PHP_VERSION, 'database' => 'connected']);
});

$router->dispatch($request);
