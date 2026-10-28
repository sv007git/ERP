<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Database;
use App\Core\Session;
use PDO;

class WebController
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::getConnection();
    }

    public function dashboard(Request $req): void
    {
        $orgId = Session::getActiveOrgId();

        $leads = $this->pdo->query("SELECT * FROM leads WHERE organization_id = '{$orgId}' ORDER BY created_at DESC LIMIT 5")->fetchAll();
        $deals = $this->pdo->query("SELECT * FROM deals WHERE organization_id = '{$orgId}' ORDER BY created_at DESC LIMIT 5")->fetchAll();
        $products = $this->pdo->query("SELECT * FROM products WHERE organization_id = '{$orgId}' ORDER BY created_at DESC LIMIT 5")->fetchAll();
        $employees = $this->pdo->query("SELECT * FROM employees WHERE organization_id = '{$orgId}' ORDER BY full_name ASC LIMIT 5")->fetchAll();
        $invoices = $this->pdo->query("SELECT * FROM invoices WHERE organization_id = '{$orgId}' ORDER BY created_at DESC LIMIT 5")->fetchAll();

        // Calculate KPI values
        $totalDeals = $this->pdo->query("SELECT COALESCE(SUM(deal_value), 0) FROM deals WHERE organization_id = '{$orgId}'")->fetchColumn();
        $totalStock = $this->pdo->query("SELECT COALESCE(SUM(quantity), 0) FROM products WHERE organization_id = '{$orgId}'")->fetchColumn();

        $html = $this->renderLayout('CRM Dashboard', $this->renderDashboardView($leads, $deals, (float)$totalDeals, (int)$totalStock, $products, $employees, $invoices));
        Response::html($html);
    }

    public function dealsView(Request $req): void
    {
        $orgId = Session::getActiveOrgId();
        $deal = $this->pdo->query("SELECT * FROM deals WHERE id = 'del-020' AND organization_id = '{$orgId}'")->fetch();
        $activities = $this->pdo->query("SELECT a.*, u.full_name as user_name FROM deal_activities a JOIN users u ON u.id = a.user_id WHERE a.deal_id = 'del-020' ORDER BY a.created_at DESC")->fetchAll();

        $html = $this->renderLayout('Deals & Activities', $this->renderDealsDetailView($deal, $activities));
        Response::html($html);
    }

    private function renderDashboardView(array $leads, array $deals, float $totalDeals, int $totalStock, array $products, array $employees, array $invoices): string
    {
        ob_start();
        ?>
        <!-- KPI Row (4 Cards) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Card 1 -->
            <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Leads</span>
                    <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                </div>
                <div class="mt-4">
                    <h3 class="text-2xl font-bold text-slate-900">$125,000</h3>
                    <div class="flex items-center mt-2 text-xs">
                        <span class="text-emerald-600 font-semibold flex items-center mr-2">↗ +12.4%</span>
                        <span class="text-slate-400">from last week</span>
                    </div>
                </div>
            </div>

            <!-- Card 2 -->
            <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Deals Closed</span>
                    <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div class="mt-4">
                    <h3 class="text-2xl font-bold text-slate-900">$<?= number_format($totalDeals, 0) ?></h3>
                    <div class="flex items-center mt-2 text-xs">
                        <span class="text-emerald-600 font-semibold flex items-center mr-2">↗ +5.3%</span>
                        <span class="text-slate-400">from last week</span>
                    </div>
                </div>
            </div>

            <!-- Card 3 -->
            <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Opportunities</span>
                    <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                </div>
                <div class="mt-4">
                    <h3 class="text-2xl font-bold text-slate-900">$185,000</h3>
                    <div class="flex items-center mt-2 text-xs">
                        <span class="text-rose-500 font-semibold flex items-center mr-2">↘ -4.35%</span>
                        <span class="text-slate-400">from last week</span>
                    </div>
                </div>
            </div>

            <!-- Card 4 -->
            <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</span>
                    <div class="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div class="mt-4">
                    <h3 class="text-2xl font-bold text-slate-900">$210,000</h3>
                    <div class="flex items-center mt-2 text-xs">
                        <span class="text-emerald-600 font-semibold flex items-center mr-2">↗ +11.8%</span>
                        <span class="text-slate-400">from last week</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2-Column Grid: Recent Leads & Recent Deals -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Recent Leads -->
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <div class="flex items-center justify-between mb-5">
                    <h4 class="text-base font-semibold text-slate-800">Recent Leads</h4>
                    <span class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">View All</span>
                </div>
                <div class="divide-y divide-slate-100">
                    <?php foreach ($leads as $l): ?>
                    <div class="py-3 flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                                <?= substr($l['name'], 0, 2) ?>
                            </div>
                            <div>
                                <div class="text-xs font-semibold text-slate-900"><?= htmlspecialchars($l['name']) ?></div>
                                <div class="text-xs text-slate-400"><?= htmlspecialchars($l['code']) ?> • <?= htmlspecialchars($l['company_name'] ?? 'Direct') ?></div>
                            </div>
                        </div>
                        <div>
                            <?php 
                            $badgeClass = match($l['status']) {
                                'Closed' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                'Not Closed' => 'bg-amber-50 text-amber-700 border-amber-200',
                                'Contacted' => 'bg-purple-50 text-purple-700 border-purple-200',
                                'Lost' => 'bg-rose-50 text-rose-700 border-rose-200',
                                default => 'bg-slate-100 text-slate-700 border-slate-200'
                            };
                            ?>
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium border <?= $badgeClass ?>">
                                <?= htmlspecialchars($l['status']) ?>
                            </span>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Recent Deals -->
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <div class="flex items-center justify-between mb-5">
                    <h4 class="text-base font-semibold text-slate-800">Recent Deals</h4>
                    <a href="/deals" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md font-medium">View Details &rarr;</a>
                </div>
                <div class="divide-y divide-slate-100">
                    <?php foreach ($deals as $d): ?>
                    <div class="py-3 flex items-center justify-between">
                        <div>
                            <div class="text-xs font-semibold text-slate-900 flex items-center">
                                <?= htmlspecialchars($d['name']) ?>
                                <span class="ml-2 text-xs text-slate-400 font-normal"><?= htmlspecialchars($d['code']) ?></span>
                            </div>
                            <div class="text-xs text-slate-400 mt-0.5">Stage: <strong class="text-slate-600"><?= htmlspecialchars($d['stage']) ?></strong> (<?= (int)$d['probability'] ?>%)</div>
                        </div>
                        <div class="text-right">
                            <div class="text-xs font-bold text-slate-900">$<?= number_format((float)$d['deal_value'], 2) ?></div>
                            <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium border <?= $d['status'] === 'Won' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ($d['status'] === 'Lost' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-sky-50 text-sky-700 border-sky-200') ?>">
                                <?= htmlspecialchars($d['status']) ?>
                            </span>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- Inventory Stocks Table -->
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8">
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-semibold text-slate-800">Recent Stocks</h4>
                <span class="text-xs text-slate-400">Total Units: <?= $totalStock ?></span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                            <th class="py-2.5 px-3">Code</th>
                            <th class="py-2.5 px-3">Product</th>
                            <th class="py-2.5 px-3">SKU</th>
                            <th class="py-2.5 px-3">Category</th>
                            <th class="py-2.5 px-3">Quantity</th>
                            <th class="py-2.5 px-3">Price</th>
                            <th class="py-2.5 px-3">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-slate-700">
                        <?php foreach ($products as $p): ?>
                        <tr class="hover:bg-slate-50 transition">
                            <td class="py-3 px-3 font-semibold text-slate-900"><?= htmlspecialchars($p['code']) ?></td>
                            <td class="py-3 px-3 font-medium text-slate-900"><?= htmlspecialchars($p['name']) ?></td>
                            <td class="py-3 px-3 text-slate-500"><?= htmlspecialchars($p['sku']) ?></td>
                            <td class="py-3 px-3"><?= htmlspecialchars($p['category']) ?></td>
                            <td class="py-3 px-3 font-semibold"><?= (int)$p['quantity'] ?></td>
                            <td class="py-3 px-3 font-semibold text-slate-900">$<?= number_format((float)$p['selling_price'], 2) ?></td>
                            <td class="py-3 px-3">
                                <span class="px-2 py-0.5 rounded-full text-xs font-medium border <?= $p['status'] === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200' ?>">
                                    <?= htmlspecialchars($p['status']) ?>
                                </span>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    private function renderDealsDetailView(array $deal, array $activities): string
    {
        ob_start();
        ?>
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <a href="/" class="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600">
                    &larr; Back
                </a>
                <div>
                    <h2 class="text-xl font-bold text-slate-900 flex items-center">
                        <?= htmlspecialchars($deal['name']) ?>
                        <span class="ml-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <?= htmlspecialchars($deal['status']) ?>
                        </span>
                    </h2>
                    <p class="text-xs text-slate-500 mt-0.5"><?= htmlspecialchars($deal['company_name'] ?? 'Nexora') ?> • <?= htmlspecialchars($deal['code']) ?></p>
                </div>
            </div>
            <div class="text-right">
                <span class="text-xs text-slate-400">Deal Value</span>
                <div class="text-2xl font-bold text-slate-900">$<?= number_format((float)$deal['deal_value'], 2) ?></div>
            </div>
        </div>

        <!-- Chevron Pipeline Progress -->
        <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-sm mb-8">
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Deal Pipeline Stage</div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs font-semibold">
                <?php
                $stages = [
                    'Qualify To Buy' => 'bg-orange-500 text-white',
                    'Contact Made' => 'bg-pink-500 text-white',
                    'Presentation' => 'bg-rose-600 text-white',
                    'Proposal Made' => 'bg-sky-500 text-white',
                    'Appointment' => 'bg-slate-200 text-slate-700'
                ];
                foreach ($stages as $stgName => $classes):
                    $isActive = ($deal['stage'] === $stgName);
                ?>
                <div class="py-2.5 px-3 rounded-lg <?= $isActive ? 'ring-2 ring-emerald-500 ring-offset-2 font-bold shadow-sm ' . $classes : 'bg-slate-100 text-slate-600' ?>">
                    <?= $stgName ?>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Activities Feed -->
        <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
            <h4 class="text-base font-semibold text-slate-800 mb-4">Activity Timeline</h4>
            <div class="space-y-4">
                <?php foreach ($activities as $act): ?>
                <div class="flex items-start space-x-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                        <?= strtoupper(substr($act['type'], 0, 1)) ?>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-900"><?= htmlspecialchars($act['title']) ?></span>
                            <span class="text-xs text-slate-400"><?= htmlspecialchars($act['created_at']) ?></span>
                        </div>
                        <p class="text-xs text-slate-600 mt-1"><?= htmlspecialchars($act['description'] ?? '') ?></p>
                        <div class="mt-2 text-xs text-slate-400 font-medium">Logged by <?= htmlspecialchars($act['user_name']) ?></div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    private function renderLayout(string $title, string $content): string
    {
        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$title} - ERP (Variant B)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased flex min-h-screen">

    <!-- Left Sidebar -->
    <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-slate-800">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-base mr-3 shadow-sm">
                ✦
            </div>
            <span class="text-base font-bold text-white tracking-wide">ERP</span>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 overflow-y-auto py-5 px-3 space-y-6 text-xs">
            <div>
                <div class="px-3 mb-2 font-bold uppercase tracking-wider text-slate-500 text-[10px]">Main</div>
                <div class="space-y-1">
                    <a href="/" class="flex items-center px-3 py-2 rounded-lg bg-emerald-500 text-white font-medium">
                        <span class="mr-3">❖</span> Dashboard
                    </a>
                    <a href="/deals" class="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition">
                        <span class="mr-3">⚡</span> Deals & Pipeline
                    </a>
                </div>
            </div>

            <div>
                <div class="px-3 mb-2 font-bold uppercase tracking-wider text-slate-500 text-[10px]">ERP Modules</div>
                <div class="space-y-1">
                    <a href="/api/v1/hrm/employees" target="_blank" class="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition">
                        <span class="mr-3">👥</span> HRMS Directory (API)
                    </a>
                    <a href="/api/v1/finance/reports/trial-balance" target="_blank" class="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition">
                        <span class="mr-3">💰</span> General Ledger & Trial Balance
                    </a>
                    <a href="/api/v1/inventory/products" target="_blank" class="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 font-medium transition">
                        <span class="mr-3">📦</span> Inventory & Warehouses
                    </a>
                </div>
            </div>
        </nav>

        <div class="p-4 border-t border-slate-800 text-xs text-slate-500">
            Variant B: PHP 8.5 + SQLite/MySQL<br>
            2026 &copy; ERP
        </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
        <!-- Top Nav Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <!-- Org Switcher -->
            <div class="flex items-center space-x-4">
                <div class="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    Falcon LLP
                </div>
                <div class="relative hidden sm:block">
                    <input type="text" placeholder="Search (Ctrl + K)..." class="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                </div>
            </div>

            <!-- Profile & Actions -->
            <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2 text-xs">
                    <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                        JA
                    </div>
                    <div class="hidden md:block">
                        <div class="font-semibold text-slate-900 leading-none">Jamie Anderson</div>
                        <div class="text-[10px] text-slate-400 mt-0.5">Super Admin</div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Page View Body -->
        <main class="flex-1 p-8 overflow-y-auto">
            {$content}
        </main>
    </div>

</body>
</html>
HTML;
    }
}
