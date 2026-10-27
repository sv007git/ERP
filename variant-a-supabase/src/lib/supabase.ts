import { createClient } from '@supabase/supabase-js';
import type { Deal, Lead, Product, Employee, Invoice, DealActivity, DealStage } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabase = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id'));

export const supabase = isLiveSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Seeds matching Dreams ERP
const initialLeads: Lead[] = [
  { id: 'led-020', code: '#LED0020', name: 'Robert Cosper', company_name: 'Nexora', status: 'Closed', source: 'Organic Search', created_at: '2026-10-20' },
  { id: 'led-019', code: '#LED0019', name: 'Helen Nelson', company_name: 'Apex Media', status: 'Not Closed', source: 'Campaigns', created_at: '2026-10-21' },
  { id: 'led-018', code: '#LED0018', name: 'Thomas Neal', company_name: 'Global Logistics', status: 'Contacted', source: 'Referral', created_at: '2026-10-22' },
  { id: 'led-017', code: '#LED0017', name: 'Sarah Spivey', company_name: 'Vortex Tech', status: 'Lost', source: 'Marketing', created_at: '2026-10-23' },
  { id: 'led-016', code: '#LED0016', name: 'Jared Griffin', company_name: 'Titan Systems', status: 'Closed', source: 'Events', created_at: '2026-10-24' }
];

const initialDeals: Deal[] = [
  { id: 'del-020', code: '#DEL0020', name: 'CRM Subscription', company_name: 'Nexora', stage: 'Qualify To Buy', probability: 90, deal_value: 154000, status: 'Open', priority: 'High', due_date: '2026-11-15', created_at: '2026-10-20' },
  { id: 'del-019', code: '#DEL0019', name: 'ERP Implementation', company_name: 'Acme Corp', stage: 'Contact Made', probability: 40, deal_value: 48000, status: 'Won', priority: 'Medium', due_date: '2026-11-30', created_at: '2026-10-21' },
  { id: 'del-018', code: '#DEL0018', name: 'Cloud Migration', company_name: 'Delta Inc', stage: 'Presentation', probability: 60, deal_value: 32000, status: 'Lost', priority: 'Low', due_date: '2026-12-05', created_at: '2026-10-22' },
  { id: 'del-017', code: '#DEL0017', name: 'Cybersecurity Upgrade', company_name: 'SecureLink', stage: 'Proposal Made', probability: 50, deal_value: 75000, status: 'Won', priority: 'High', due_date: '2026-11-20', created_at: '2026-10-23' },
  { id: 'del-016', code: '#DEL0016', name: 'SaaS Renewal', company_name: 'Echo Media', stage: 'Appointment', probability: 70, deal_value: 25000, status: 'Lost', priority: 'Medium', due_date: '2026-12-01', created_at: '2026-10-24' }
];

const initialProducts: Product[] = [
  { id: 'prd-020', code: '#PRD0020', name: 'Apple iPhone 15', sku: 'APP-PH-15', category: 'Smartphones', unit: 'Piece', quantity: 2, selling_price: 250, purchase_price: 230, status: 'In Stock' },
  { id: 'prd-019', code: '#PRD0019', name: 'Dell XPS 13 9310', sku: 'DEL-LAP-9310', category: 'Computers', unit: 'Piece', quantity: 12, selling_price: 300, purchase_price: 280, status: 'In Stock' },
  { id: 'prd-018', code: '#PRD0018', name: 'Bose QuietComfort 45', sku: 'BOS-HD-45', category: 'Headphones', unit: 'Piece', quantity: 15, selling_price: 100, purchase_price: 80, status: 'In Stock' },
  { id: 'prd-017', code: '#PRD0017', name: 'Adidas Running Shoe', sku: 'ADI-SHO-RUN', category: 'Footwear', unit: 'Pack', quantity: 20, selling_price: 400, purchase_price: 380, status: 'In Stock' },
  { id: 'prd-016', code: '#PRD0016', name: 'Dyson Vacuum Cleaner', sku: 'DYS-VC-100', category: 'Appliances', unit: 'Piece', quantity: 0, selling_price: 750, purchase_price: 730, status: 'Out of Stock' }
];

const initialEmployees: Employee[] = [
  { id: 'emp-001', employee_code: 'EMP-001', full_name: 'Alex Thompson', email: 'alex@falcon.com', department_name: 'Engineering', position: 'Senior Developer', salary: 8500, leave_balance: 20, status: 'Active' },
  { id: 'emp-002', employee_code: 'EMP-002', full_name: 'Maria Garcia', email: 'maria@falcon.com', department_name: 'Engineering', position: 'UX Designer', salary: 7200, leave_balance: 18, status: 'Active' },
  { id: 'emp-003', employee_code: 'EMP-003', full_name: 'Thomas Mervin', email: 'thomas@falcon.com', department_name: 'Sales', position: 'Sales Lead', salary: 6800, leave_balance: 15, status: 'Active' }
];

const initialInvoices: Invoice[] = [
  { id: 'inv-020', invoice_number: '#INV0020', customer_name: 'Alexander Kenn', invoice_date: '2026-09-11', total_amount: 500, paid_amount: 500, status: 'Paid' },
  { id: 'inv-019', invoice_number: '#INV0019', customer_name: 'Gabriella White', invoice_date: '2026-09-15', total_amount: 650, paid_amount: 0, status: 'Pending' }
];

const initialActivities: DealActivity[] = [
  { id: 'act-001', deal_id: 'del-020', user_name: 'Jamie Anderson', type: 'meeting', title: 'Product Meeting', description: 'Review roadmap & tech milestones with client.', created_at: '2026-10-25 10:30' },
  { id: 'act-002', deal_id: 'del-020', user_name: 'Robert Cosper', type: 'call', title: 'Pricing Call', description: 'Agreed on 90% closing probability and annual contract.', created_at: '2026-10-26 14:15' }
];

// Offline & Local Mock Store
export class LocalErpStore {
  private static leads: Lead[] = [...initialLeads];
  private static deals: Deal[] = [...initialDeals];
  private static products: Product[] = [...initialProducts];
  private static employees: Employee[] = [...initialEmployees];
  private static invoices: Invoice[] = [...initialInvoices];
  private static activities: DealActivity[] = [...initialActivities];

  static getLeads(): Lead[] {
    return this.leads;
  }

  static getDeals(): Deal[] {
    return this.deals;
  }

  static getDeal(id: string): Deal | undefined {
    return this.deals.find(d => d.id === id);
  }

  static updateDealStage(id: string, stage: DealStage, probability: number): Deal {
    const deal = this.deals.find(d => d.id === id);
    if (!deal) throw new Error('Deal not found');
    deal.stage = stage;
    deal.probability = probability;
    deal.status = stage === 'Won' ? 'Won' : (stage === 'Lost' ? 'Lost' : 'Open');
    return { ...deal };
  }

  static getActivities(dealId: string): DealActivity[] {
    return this.activities.filter(a => a.deal_id === dealId);
  }

  static addActivity(dealId: string, activity: Omit<DealActivity, 'id' | 'deal_id' | 'created_at'>): DealActivity {
    const newAct: DealActivity = {
      ...activity,
      id: 'act-' + Math.random().toString(36).substring(7),
      deal_id: dealId,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.activities.unshift(newAct);
    return newAct;
  }

  static getProducts(): Product[] {
    return this.products;
  }

  static adjustStock(productId: string, deltaQty: number): Product {
    const prod = this.products.find(p => p.id === productId);
    if (!prod) throw new Error('Product not found');
    prod.quantity += deltaQty;
    prod.status = prod.quantity > 0 ? 'In Stock' : 'Out of Stock';
    return { ...prod };
  }

  static getEmployees(): Employee[] {
    return this.employees;
  }

  static deductLeave(employeeId: string, days: number): Employee {
    const emp = this.employees.find(e => e.id === employeeId);
    if (!emp) throw new Error('Employee not found');
    emp.leave_balance -= days;
    return { ...emp };
  }

  static getInvoices(): Invoice[] {
    return this.invoices;
  }

  static recordPayment(invoiceId: string, amount: number): Invoice {
    const inv = this.invoices.find(i => i.id === invoiceId);
    if (!inv) throw new Error('Invoice not found');
    inv.paid_amount += amount;
    if (inv.paid_amount >= inv.total_amount) {
      inv.status = 'Paid';
    } else {
      inv.status = 'Partially Paid';
    }
    return { ...inv };
  }
}
