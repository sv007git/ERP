import { describe, it, expect } from 'vitest';
import { LocalErpStore } from './lib/supabase';

describe('Dreams ERP Variant A - Business Logic Unit Tests', () => {
  it('loads seeded CRM leads and deals matching Dreams ERP', () => {
    const leads = LocalErpStore.getLeads();
    const deals = LocalErpStore.getDeals();

    expect(leads.length).toBeGreaterThanOrEqual(5);
    expect(leads[0].code).toBe('#LED0020');
    expect(leads[0].name).toBe('Robert Cosper');

    expect(deals.length).toBeGreaterThanOrEqual(5);
    expect(deals[0].code).toBe('#DEL0020');
    expect(deals[0].name).toBe('CRM Subscription');
  });

  it('advances deal pipeline stages with correct probabilities', () => {
    const updated = LocalErpStore.updateDealStage('del-020', 'Won', 100);

    expect(updated.stage).toBe('Won');
    expect(updated.probability).toBe(100);
    expect(updated.status).toBe('Won');
  });

  it('records activities on a deal', () => {
    const act = LocalErpStore.addActivity('del-020', {
      title: 'Contract Signing',
      description: 'Signed annual SaaS contract with client.',
      type: 'task',
      user_name: 'Jamie Anderson'
    });

    expect(act.title).toBe('Contract Signing');
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
});
