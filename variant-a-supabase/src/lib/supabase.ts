import { createClient } from '@supabase/supabase-js';
import type { 
  Deal, 
  Lead, 
  Product, 
  Employee, 
  Invoice, 
  DealActivity, 
  DealStage,
  SalesOrder,
  PurchaseOrder,
  Project,
  Ticket
} from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://clobwkkjltlhxishhyhm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsb2J3a2tqbHRsaHhpc2hoeWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwOTUzNDIsImV4cCI6MjEwODY3MTM0Mn0.1Nr57cJLY5fImP1GNcSOpMarCdc9xdE4KCe1kpNe4OM';

export const isLiveSupabase = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id'));

export const supabase = isLiveSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY_PREFIX = 'erp_';

function loadStorage<T>(key: string, defaultVal: T): T {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (raw) return JSON.parse(raw);
    }
  } catch {
    // fallback to default
  }
  return defaultVal;
}

function saveStorage<T>(key: string, val: T): void {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
    }
  } catch {
    // silent fallback
  }
}

// Initial Seeds matching ERP UI Reference Artifacts
const defaultLeads: Lead[] = [
  { id: 'led-020', code: '#LED0020', name: 'Robert Cosper', company_name: 'Nexora', status: 'Closed', source: 'Organic Search', created_at: '2026-10-20' },
  { id: 'led-019', code: '#LED0019', name: 'Helen Nelson', company_name: 'Apex Media', status: 'Not Closed', source: 'Campaigns', created_at: '2026-10-21' },
  { id: 'led-018', code: '#LED0018', name: 'Thomas Neal', company_name: 'Global Logistics', status: 'Contacted', source: 'Referral', created_at: '2026-10-22' },
  { id: 'led-017', code: '#LED0017', name: 'Sarah Spivey', company_name: 'Vortex Tech', status: 'Lost', source: 'Marketing', created_at: '2026-10-23' },
  { id: 'led-016', code: '#LED0016', name: 'Jared Griffin', company_name: 'Titan Systems', status: 'Closed', source: 'Events', created_at: '2026-10-24' }
];

const defaultDeals: Deal[] = [
  { 
    id: 'del-020', 
    code: '#DEL0020', 
    name: 'CRM Subscription', 
    company_name: 'Nexora', 
    address: '22, Ave Street, Newyork, USA',
    stage: 'Qualify To Buy', 
    probability: 80, 
    deal_value: 2511145, 
    status: 'Won', 
    priority: 'High', 
    source: 'Paid Campaign',
    due_date: '27 Sep 2025, 11:00 AM', 
    follow_up_date: '27 Sep 2025',
    tags: ['Collab', 'VIP'],
    projects: ['Dreams Food', 'Craftesty'],
    owners: ['Robert Cosper'],
    contacts: ['Robert Cosper'],
    last_modified: '15 Sep 2025, 04:10 PM',
    modified_by: 'Robert Cosper',
    created_at: '10 Sep 2025, 10:30 AM' 
  },
  { 
    id: 'del-019', 
    code: '#DEL0019', 
    name: 'ERP Implementation', 
    company_name: 'Acme Corp', 
    address: '500 Tech Blvd, San Francisco, USA',
    stage: 'Contact Made', 
    probability: 40, 
    deal_value: 48000, 
    status: 'Won', 
    priority: 'Medium', 
    source: 'Referral',
    due_date: '30 Nov 2026', 
    follow_up_date: '15 Nov 2026',
    tags: ['Enterprise'],
    projects: ['Office Management App'],
    owners: ['Ethan Walker'],
    contacts: ['Ethan Walker'],
    created_at: '21 Oct 2026' 
  },
  { 
    id: 'del-018', 
    code: '#DEL0018', 
    name: 'Cloud Migration', 
    company_name: 'Delta Inc', 
    stage: 'Presentation', 
    probability: 60, 
    deal_value: 32000, 
    status: 'Lost', 
    priority: 'Low', 
    source: 'Organic Search',
    due_date: '05 Dec 2026', 
    created_at: '22 Oct 2026' 
  },
  { 
    id: 'del-017', 
    code: '#DEL0017', 
    name: 'Cybersecurity Upgrade', 
    company_name: 'SecureLink', 
    stage: 'Proposal Made', 
    probability: 50, 
    deal_value: 75000, 
    status: 'Won', 
    priority: 'High', 
    source: 'Campaigns',
    due_date: '20 Nov 2026', 
    created_at: '23 Oct 2026' 
  },
  { 
    id: 'del-016', 
    code: '#DEL0016', 
    name: 'SaaS Renewal', 
    company_name: 'Echo Media', 
    stage: 'Appointment', 
    probability: 70, 
    deal_value: 25000, 
    status: 'Lost', 
    priority: 'Medium', 
    source: 'Events',
    due_date: '01 Dec 2026', 
    created_at: '24 Oct 2026' 
  }
];

const defaultActivities: DealActivity[] = [
  // Today Group
  { 
    id: 'act-001', 
    deal_id: 'del-020', 
    user_name: 'Jamie Anderson', 
    type: 'meeting', 
    title: 'Product Meeting', 
    description: 'A product team meeting is a gathering of the cross-functional product team — ideally including team members from product, engineering, marketing, and customer support.', 
    created_at: '25 Jul 2025, 05:00 pm',
    date_group: 'Today',
    priority: 'High',
    reminder: '15 Mins Before',
    assigned_to: 'Jamie Anderson'
  },
  // 28 Sep 2025 Group
  { 
    id: 'act-002', 
    deal_id: 'del-020', 
    user_name: 'Jamie Anderson', 
    type: 'activity', 
    title: 'You sent 1 Message to the contact.', 
    description: 'Shared the executive overview and revised pricing schedule with the primary stakeholder.', 
    created_at: '10:25 pm',
    date_group: '28 Sep 2025'
  },
  { 
    id: 'act-003', 
    deal_id: 'del-020', 
    user_name: 'Denwar', 
    type: 'call', 
    title: 'Denwar responded to your appointment schedule question by call at 09:30pm.', 
    description: 'Customer confirmed availability for technical architecture walkthrough on Thursday morning.', 
    created_at: '09:25 pm',
    date_group: '28 Sep 2025',
    call_outcome: 'Scheduled'
  },
  { 
    id: 'act-004', 
    deal_id: 'del-020', 
    user_name: 'Antony', 
    type: 'note', 
    title: 'Notes added by Antony', 
    description: 'Please accept my apologies for the inconvenience caused. Additional license tier has been verified.', 
    created_at: '09:25 pm',
    date_group: '28 Sep 2025'
  },
  // 27 Sep 2025 Group
  { 
    id: 'act-005', 
    deal_id: 'del-020', 
    user_name: 'Abraham', 
    type: 'meeting', 
    title: 'Meeting With Abraham', 
    description: 'Scheduleed on 05:00 pm to finalize legal contracts and SLA commitments.', 
    created_at: '05:00 pm',
    date_group: '27 Sep 2025'
  },
  { 
    id: 'act-006', 
    deal_id: 'del-020', 
    user_name: 'Drain', 
    type: 'activity', 
    title: 'Drain responded to your appointment schedule question.', 
    description: 'Clarified timezone coordination for offshore dev leads.', 
    created_at: '09:25 pm',
    date_group: '27 Sep 2025'
  }
];

const defaultProducts: Product[] = [
  { id: 'prd-020', code: '#PRD0020', name: 'Apple iPhone 15', sku: 'APP-PH-15', category: 'Smartphones', brand: 'Apple', unit: 'Piece', quantity: 2, selling_price: 250, purchase_price: 230, status: 'In Stock' },
  { id: 'prd-019', code: '#PRD0019', name: 'Dell XPS 13 9310', sku: 'DEL-LAP-9310', category: 'Computers', brand: 'Dell', unit: 'Piece', quantity: 12, selling_price: 300, purchase_price: 280, status: 'In Stock' },
  { id: 'prd-018', code: '#PRD0018', name: 'Bose QuietComfort 45', sku: 'BOS-HD-45', category: 'Headphones', brand: 'Bose', unit: 'Piece', quantity: 15, selling_price: 100, purchase_price: 80, status: 'In Stock' },
  { id: 'prd-017', code: '#PRD0017', name: 'Adidas Running Shoe', sku: 'ADI-SHO-RUN', category: 'Footwear', brand: 'Adidas', unit: 'Pack', quantity: 20, selling_price: 400, purchase_price: 380, status: 'In Stock' },
  { id: 'prd-016', code: '#PRD0016', name: 'Dyson Vacuum Cleaner', sku: 'DYS-VC-100', category: 'Appliances', brand: 'Dyson', unit: 'Piece', quantity: 0, selling_price: 750, purchase_price: 730, status: 'Out of Stock' }
];

const defaultEmployees: Employee[] = [
  { id: 'emp-001', employee_code: 'EMP-001', full_name: 'Alex Thompson', email: 'alex@falcon.com', department_name: 'Engineering', position: 'Senior Developer', salary: 8500, leave_balance: 20, status: 'Active' },
  { id: 'emp-002', employee_code: 'EMP-002', full_name: 'Maria Garcia', email: 'maria@falcon.com', department_name: 'Engineering', position: 'UX Designer', salary: 7200, leave_balance: 18, status: 'Active' },
  { id: 'emp-003', employee_code: 'EMP-003', full_name: 'Thomas Mervin', email: 'thomas@falcon.com', department_name: 'Sales', position: 'Sales Lead', salary: 6800, leave_balance: 15, status: 'Active' },
  { id: 'emp-004', employee_code: 'EMP-004', full_name: 'Regina Bryant', email: 'regina@falcon.com', department_name: 'Engineering', position: 'Android Developer', salary: 7500, leave_balance: 14, status: 'Active' },
  { id: 'emp-005', employee_code: 'EMP-005', full_name: 'Evelyn Hayes', email: 'evelyn@falcon.com', department_name: 'Product', position: 'Product Manager', salary: 9200, leave_balance: 22, status: 'Active' }
];

const defaultInvoices: Invoice[] = [
  { id: 'inv-020', invoice_number: '#INV0020', customer_name: 'Alexander Kenn', invoice_date: '2026-09-11', total_amount: 500, paid_amount: 500, status: 'Paid' },
  { id: 'inv-019', invoice_number: '#INV0019', customer_name: 'Gabriella White', invoice_date: '2026-09-15', total_amount: 650, paid_amount: 0, status: 'Pending' },
  { id: 'inv-018', invoice_number: '#INV0018', customer_name: 'Christopher Rey', invoice_date: '2026-08-27', total_amount: 300, paid_amount: 0, status: 'Pending' },
  { id: 'inv-017', invoice_number: '#INV0017', customer_name: 'Penelope Ton', invoice_date: '2026-08-15', total_amount: 850, paid_amount: 850, status: 'Paid' },
  { id: 'inv-016', invoice_number: '#INV0016', customer_name: 'Catherine Lan', invoice_date: '2026-08-02', total_amount: 600, paid_amount: 0, status: 'Pending' }
];

const defaultSalesOrders: SalesOrder[] = [
  { id: 'sao-019', order_number: '#SAO0019', customer_name: 'Gabriella White', order_date: '2026-09-05', total_amount: 650, status: 'Pending' },
  { id: 'sao-018', order_number: '#SAO0018', customer_name: 'Alexander Kenn', order_date: '2026-09-01', total_amount: 1200, status: 'Confirmed' },
  { id: 'sao-017', order_number: '#SAO0017', customer_name: 'Thomas Neal', order_date: '2026-08-28', total_amount: 450, status: 'Dispatched' }
];

const defaultPurchaseOrders: PurchaseOrder[] = [
  { id: 'po-020', po_number: '#POD0020', supplier_name: 'Alpha Distributors', category: 'Raw Materials', order_date: '2026-09-11', delivery_date: '2026-09-15', total_amount: 500, ordered_qty: 2, delivered_qty: 2, status: 'Delivered' },
  { id: 'po-019', po_number: '#POD0019', supplier_name: 'Beta Industries', category: 'IT Equipment', order_date: '2026-09-05', delivery_date: '2026-09-12', total_amount: 650, ordered_qty: 3, delivered_qty: 0, status: 'Pending' },
  { id: 'po-018', po_number: '#POD0018', supplier_name: 'Zenith Supplies', category: 'IT Equipment', order_date: '2026-08-27', delivery_date: '2026-09-01', total_amount: 120, ordered_qty: 5, delivered_qty: 5, status: 'Delivered' },
  { id: 'po-017', po_number: '#POD0017', supplier_name: 'Orion Equipments', category: 'Office Supplies', order_date: '2026-08-16', delivery_date: '2026-08-25', total_amount: 860, ordered_qty: 10, delivered_qty: 4, status: 'Partially Delivered' }
];

const defaultProjects: Project[] = [
  { id: 'pro-020', code: '#PRO0020', name: 'Office Management App', description: 'Streamlines administrative tasks by integrating tools for scheduling, communication, and tasks.', progress: 35, team_leader: 'Ethan Walker', team_members: ['Alex T.', 'Maria G.', 'Thomas M.'], deadline: '11 Sep 2025', status: 'In Progress' },
  { id: 'pro-019', code: '#PRO0019', name: 'Clinic Management', description: 'Simplifies patient records, appointments, billing, and staff coordination for healthcare facilities.', progress: 50, team_leader: 'Madison Clark', team_members: ['Sarah S.', 'Jared G.'], deadline: '05 Sep 2025', status: 'In Progress' },
  { id: 'pro-018', code: '#PRO0018', name: 'Educational Platform', description: 'Enables online learning with courses, assessments, progress tracking, and interactive content.', progress: 90, team_leader: 'James Harris', team_members: ['Regina B.', 'Evelyn H.'], deadline: '27 Aug 2025', status: 'In Progress' },
  { id: 'pro-017', code: '#PRO0017', name: 'Chat & Call Mobile App', description: 'Facilitates seamless messaging, voice, and video communication in real-time.', progress: 25, team_leader: 'Avery Thompson', team_members: ['Ethan W.', 'Maria G.'], deadline: '16 Aug 2025', status: 'In Progress' },
  { id: 'pro-016', code: '#PRO0016', name: 'Travel Planning Website', description: 'Helps users plan trips, book accommodations, and explore destinations efficiently.', progress: 70, team_leader: 'Benjamin Wright', team_members: ['Alex T.'], deadline: '25 Jul 2025', status: 'In Progress' },
  { id: 'pro-015', code: '#PRO0015', name: 'Service Booking Software', description: 'Automates appointment scheduling, payments, and reminders for service-based businesses.', progress: 100, team_leader: 'Chloe Mitchell', team_members: ['Thomas M.', 'Regina B.'], deadline: '12 Jul 2025', status: 'Completed' }
];

const defaultTickets: Ticket[] = [
  { id: 'tkt-020', code: '#TKT0020', customer_name: 'Alexander Kenn', subject: 'Login Issue', priority: 'Low', status: 'Open', assigned_to: 'Steven Schroer', created_at: '11 Sep 2025', last_updated: '26 Sep 2025' },
  { id: 'tkt-019', code: '#TKT0019', customer_name: 'Gabriella White', subject: 'Invoice Query', priority: 'Medium', status: 'Pending', assigned_to: 'Regina Bryant', created_at: '05 Sep 2025', last_updated: '20 Sep 2025' },
  { id: 'tkt-018', code: '#TKT0018', customer_name: 'Christopher Rey', subject: 'Password Reset', priority: 'High', status: 'Resolved', assigned_to: 'James Parker', created_at: '27 Aug 2025', last_updated: '11 Sep 2025' },
  { id: 'tkt-017', code: '#TKT0017', customer_name: 'Penelope Ton', subject: 'Purchase Order Issue', priority: 'Low', status: 'Closed', assigned_to: 'Muriel Hood', created_at: '16 Aug 2025', last_updated: '31 Aug 2025' },
  { id: 'tkt-011', code: '#TKT0011', customer_name: 'Catherine Lan', subject: 'Bug Report', priority: 'Low', status: 'Pending', assigned_to: 'Tina Williams', created_at: '18 May 2025', last_updated: '02 Jun 2025' }
];

export class LocalErpStore {
  private static leads: Lead[] = loadStorage('leads', defaultLeads);
  private static deals: Deal[] = loadStorage('deals', defaultDeals);
  private static activities: DealActivity[] = loadStorage('activities', defaultActivities);
  private static products: Product[] = loadStorage('products', defaultProducts);
  private static employees: Employee[] = loadStorage('employees', defaultEmployees);
  private static invoices: Invoice[] = loadStorage('invoices', defaultInvoices);
  private static salesOrders: SalesOrder[] = loadStorage('sales_orders', defaultSalesOrders);
  private static purchaseOrders: PurchaseOrder[] = loadStorage('purchase_orders', defaultPurchaseOrders);
  private static projects: Project[] = loadStorage('projects', defaultProjects);
  private static tickets: Ticket[] = loadStorage('tickets', defaultTickets);

  // LEADS
  static getLeads(): Lead[] {
    return this.leads;
  }

  static addLead(lead: Omit<Lead, 'id' | 'code' | 'created_at'>): Lead {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newLead: Lead = {
      ...lead,
      id: 'led-' + Math.random().toString(36).substring(7),
      code: '#LED' + num,
      created_at: new Date().toISOString().substring(0, 10)
    };
    this.leads.unshift(newLead);
    saveStorage('leads', this.leads);

    if (supabase) {
      supabase.from('leads').insert({
        organization_id: '00000000-0000-0000-0000-000000000001',
        code: newLead.code,
        name: newLead.name,
        company_name: newLead.company_name,
        status: newLead.status,
        source: newLead.source
      }).then(res => {
        if (res.error) console.info('Supabase cloud sync info:', res.error.message);
      });
    }

    return newLead;
  }

  // DEALS
  static getDeals(): Deal[] {
    return this.deals;
  }

  static getDeal(id: string): Deal | undefined {
    return this.deals.find(d => d.id === id);
  }

  static addDeal(deal: Omit<Deal, 'id' | 'code' | 'created_at'>): Deal {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newDeal: Deal = {
      ...deal,
      id: 'del-' + Math.random().toString(36).substring(7),
      code: '#DEL' + num,
      created_at: new Date().toISOString().substring(0, 10)
    };
    this.deals.unshift(newDeal);
    saveStorage('deals', this.deals);

    if (supabase) {
      supabase.from('deals').insert({
        organization_id: '00000000-0000-0000-0000-000000000001',
        code: newDeal.code,
        name: newDeal.name,
        company_name: newDeal.company_name,
        stage: newDeal.stage,
        probability: newDeal.probability,
        deal_value: newDeal.deal_value,
        status: newDeal.status,
        priority: newDeal.priority
      }).then(res => {
        if (res.error) console.info('Supabase cloud sync info:', res.error.message);
      });
    }

    return newDeal;
  }

  static updateDealStage(id: string, stage: DealStage, probability: number): Deal {
    const deal = this.deals.find(d => d.id === id);
    if (!deal) throw new Error('Deal not found');
    deal.stage = stage;
    deal.probability = probability;
    deal.status = stage === 'Won' ? 'Won' : (stage === 'Lost' ? 'Lost' : 'Open');
    saveStorage('deals', this.deals);

    if (supabase) {
      supabase.from('deals').update({
        stage: deal.stage,
        probability: deal.probability,
        status: deal.status
      }).eq('id', id).then(res => {
        if (res.error) console.info('Supabase cloud sync info:', res.error.message);
      });
    }

    return { ...deal };
  }

  static updateDealStatus(id: string, status: 'Open' | 'Won' | 'Lost'): Deal {
    const deal = this.deals.find(d => d.id === id);
    if (!deal) throw new Error('Deal not found');
    deal.status = status;
    if (status === 'Won') {
      deal.probability = 100;
    } else if (status === 'Lost') {
      deal.probability = 0;
    }
    saveStorage('deals', this.deals);
    return { ...deal };
  }

  static deleteDeal(id: string): void {
    this.deals = this.deals.filter(d => d.id !== id);
    saveStorage('deals', this.deals);
    if (supabase) {
      supabase.from('deals').delete().eq('id', id).then();
    }
  }

  // ACTIVITIES, NOTES, CALLS, FILES, EMAIL
  static getActivities(dealId: string): DealActivity[] {
    return this.activities.filter(a => a.deal_id === dealId);
  }

  static addActivity(dealId: string, activity: Omit<DealActivity, 'id' | 'deal_id' | 'created_at'>): DealActivity {
    const newAct: DealActivity = {
      ...activity,
      id: 'act-' + Math.random().toString(36).substring(7),
      deal_id: dealId,
      date_group: activity.date_group || 'Today',
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.activities.unshift(newAct);
    saveStorage('activities', this.activities);
    return newAct;
  }

  // PRODUCTS & STOCK
  static getProducts(): Product[] {
    return this.products;
  }

  static addProduct(prod: Omit<Product, 'id' | 'code'>): Product {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newProd: Product = {
      ...prod,
      id: 'prd-' + Math.random().toString(36).substring(7),
      code: '#PRD' + num
    };
    this.products.unshift(newProd);
    saveStorage('products', this.products);
    return newProd;
  }

  static adjustStock(productId: string, deltaQty: number): Product {
    const prod = this.products.find(p => p.id === productId);
    if (!prod) throw new Error('Product not found');
    prod.quantity += deltaQty;
    prod.status = prod.quantity > 0 ? 'In Stock' : 'Out of Stock';
    saveStorage('products', this.products);
    return { ...prod };
  }

  // EMPLOYEES & WORKFORCE
  static getEmployees(): Employee[] {
    return this.employees;
  }

  static addEmployee(emp: Omit<Employee, 'id' | 'employee_code'>): Employee {
    const num = Math.floor(100 + Math.random() * 900);
    const newEmp: Employee = {
      ...emp,
      id: 'emp-' + Math.random().toString(36).substring(7),
      employee_code: 'EMP-' + num
    };
    this.employees.push(newEmp);
    saveStorage('employees', this.employees);
    return newEmp;
  }

  static deductLeave(employeeId: string, days: number): Employee {
    const emp = this.employees.find(e => e.id === employeeId);
    if (!emp) throw new Error('Employee not found');
    emp.leave_balance = Math.max(0, emp.leave_balance - days);
    saveStorage('employees', this.employees);
    return { ...emp };
  }

  // INVOICES & PAYMENTS
  static getInvoices(): Invoice[] {
    return this.invoices;
  }

  static createInvoice(inv: Omit<Invoice, 'id' | 'invoice_number' | 'paid_amount' | 'status'>): Invoice {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newInv: Invoice = {
      ...inv,
      id: 'inv-' + Math.random().toString(36).substring(7),
      invoice_number: '#INV' + num,
      paid_amount: 0,
      status: 'Pending'
    };
    this.invoices.unshift(newInv);
    saveStorage('invoices', this.invoices);
    return newInv;
  }

  static recordPayment(invoiceId: string, amount: number): Invoice {
    const inv = this.invoices.find(i => i.id === invoiceId);
    if (!inv) throw new Error('Invoice not found');
    inv.paid_amount += amount;
    inv.status = inv.paid_amount >= inv.total_amount ? 'Paid' : 'Partially Paid';
    saveStorage('invoices', this.invoices);
    return { ...inv };
  }

  // SALES ORDERS
  static getSalesOrders(): SalesOrder[] {
    return this.salesOrders;
  }

  static createSalesOrder(order: Omit<SalesOrder, 'id' | 'order_number' | 'status'>): SalesOrder {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newOrder: SalesOrder = {
      ...order,
      id: 'sao-' + Math.random().toString(36).substring(7),
      order_number: '#SAO' + num,
      status: 'Pending'
    };
    this.salesOrders.unshift(newOrder);
    saveStorage('sales_orders', this.salesOrders);
    return newOrder;
  }

  // PURCHASE ORDERS
  static getPurchaseOrders(): PurchaseOrder[] {
    return this.purchaseOrders;
  }

  static createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'po_number' | 'status' | 'delivered_qty'>): PurchaseOrder {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newPo: PurchaseOrder = {
      ...po,
      id: 'po-' + Math.random().toString(36).substring(7),
      po_number: '#POD' + num,
      delivered_qty: 0,
      status: 'Pending'
    };
    this.purchaseOrders.unshift(newPo);
    saveStorage('purchase_orders', this.purchaseOrders);
    return newPo;
  }

  // PROJECTS
  static getProjects(): Project[] {
    return this.projects;
  }

  static addProject(proj: Omit<Project, 'id' | 'code'>): Project {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newProj: Project = {
      ...proj,
      id: 'pro-' + Math.random().toString(36).substring(7),
      code: '#PRO' + num
    };
    this.projects.unshift(newProj);
    saveStorage('projects', this.projects);
    return newProj;
  }

  // SUPPORT TICKETS
  static getTickets(): Ticket[] {
    return this.tickets;
  }

  static addTicket(tkt: Omit<Ticket, 'id' | 'code' | 'created_at' | 'last_updated'>): Ticket {
    const num = Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString().substring(0, 10);
    const newTicket: Ticket = {
      ...tkt,
      id: 'tkt-' + Math.random().toString(36).substring(7),
      code: '#TKT' + num,
      created_at: now,
      last_updated: now
    };
    this.tickets.unshift(newTicket);
    saveStorage('tickets', this.tickets);
    return newTicket;
  }

  static updateTicketStatus(id: string, status: 'Open' | 'Pending' | 'Resolved' | 'Closed'): Ticket {
    const tkt = this.tickets.find(t => t.id === id);
    if (!tkt) throw new Error('Ticket not found');
    tkt.status = status;
    tkt.last_updated = new Date().toISOString().substring(0, 10);
    saveStorage('tickets', this.tickets);
    return { ...tkt };
  }
}
