import { describe, it, expect } from 'vitest';
import { LocalErpStore } from './lib/supabase';

describe('ERP Variant A - Comprehensive Business Logic Unit Tests', () => {
  it('loads seeded CRM leads and deals matching ERP specification', () => {
    const leads = LocalErpStore.getLeads();
    const deals = LocalErpStore.getDeals();

    expect(leads.length).toBeGreaterThanOrEqual(5);
    expect(leads[0].code).toBe('#LED0020');
    expect(leads[0].name).toBe('Robert Cosper');

    expect(deals.length).toBeGreaterThanOrEqual(5);
    expect(deals[0].code).toBe('#DEL0020');
    expect(deals[0].name).toBe('CRM Subscription');
    expect(deals[0].deal_value).toBe(2511145);
  });

  it('advances deal pipeline stages with correct probabilities', () => {
    const updated = LocalErpStore.updateDealStage('del-020', 'Won', 100);

    expect(updated.stage).toBe('Won');
    expect(updated.probability).toBe(100);
    expect(updated.status).toBe('Won');
  });

  it('records activities on a deal across date groups', () => {
    const act = LocalErpStore.addActivity('del-020', {
      title: 'Contract Signing & SLA Walkthrough',
      description: 'Signed annual SaaS contract with client legal team.',
      type: 'meeting',
      date_group: 'Today',
      user_name: 'Jamie Anderson'
    });

    expect(act.title).toBe('Contract Signing & SLA Walkthrough');
    expect(act.user_name).toBe('Jamie Anderson');

    const activities = LocalErpStore.getActivities('del-020');
    expect(activities.some(a => a.id === act.id)).toBe(true);
  });

  it('adjusts inventory stock quantities and status', () => {
    const initial = LocalErpStore.getProducts().find(p => p.id === 'prd-020')!;
    const prevQty = initial.quantity;

    const updated = LocalErpStore.adjustStock('prd-020', 10);
    expect(updated.quantity).toBe(prevQty + 10);
    expect(updated.status).toBe('In Stock');
  });

  it('deducts employee leave balance on approval', () => {
    const empBefore = LocalErpStore.getEmployees().find(e => e.id === 'emp-001')!;
    const balBefore = empBefore.leave_balance;

    const empAfter = LocalErpStore.deductLeave('emp-001', 3);
    expect(empAfter.leave_balance).toBe(balBefore - 3);
  });

  it('settles invoice payments and transitions status', () => {
    const paid = LocalErpStore.recordPayment('inv-019', 650);
    expect(paid.status).toBe('Paid');
    expect(paid.paid_amount).toBe(650);
  });

  it('creates purchase orders and tracks procurement volume', () => {
    const po = LocalErpStore.createPurchaseOrder({
      supplier_name: 'Orion Equipments',
      category: 'Office Supplies',
      total_amount: 860,
      ordered_qty: 10,
      order_date: '2026-10-28',
      delivery_date: '2026-11-05'
    });

    expect(po.supplier_name).toBe('Orion Equipments');
    expect(po.status).toBe('Pending');
    expect(LocalErpStore.getPurchaseOrders().some(p => p.id === po.id)).toBe(true);
  });

  it('creates projects and tracks completion progress', () => {
    const proj = LocalErpStore.addProject({
      name: 'Mobile Fleet Management',
      description: 'GPS telemetry tracking and route optimization software.',
      progress: 45,
      team_leader: 'Avery Thompson',
      team_members: ['Alex T.', 'Thomas M.'],
      deadline: '2026-12-15',
      status: 'In Progress'
    });

    expect(proj.name).toBe('Mobile Fleet Management');
    expect(proj.progress).toBe(45);
    expect(LocalErpStore.getProjects().some(p => p.id === proj.id)).toBe(true);
  });

  it('creates support tickets and resolves issues', () => {
    const tkt = LocalErpStore.addTicket({
      customer_name: 'Nexus Dynamics',
      subject: 'SSO Authentication Failure',
      priority: 'High',
      assigned_to: 'Steven Schroer',
      status: 'Open'
    });

    expect(tkt.status).toBe('Open');
    const resolved = LocalErpStore.updateTicketStatus(tkt.id, 'Resolved');
    expect(resolved.status).toBe('Resolved');
  });
});
