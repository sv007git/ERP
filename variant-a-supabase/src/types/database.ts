export interface Organization {
  id: string;
  name: string;
  slug: string;
  currency: string;
}

export interface UserProfile {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export interface Lead {
  id: string;
  code: string;
  name: string;
  company_name: string | null;
  status: 'Closed' | 'Not Closed' | 'Contacted' | 'Lost';
  source: string;
  created_at: string;
}

export type DealStage = 
  | 'Qualify To Buy'
  | 'Contact Made'
  | 'Presentation'
  | 'Proposal Made'
  | 'Appointment'
  | 'Won'
  | 'Lost';

export interface Deal {
  id: string;
  code: string;
  name: string;
  company_name: string | null;
  stage: DealStage;
  probability: number;
  deal_value: number;
  status: 'Open' | 'Won' | 'Lost';
  priority: 'Low' | 'Medium' | 'High';
  due_date: string | null;
  created_at: string;
}

export interface DealActivity {
  id: string;
  deal_id: string;
  user_name: string;
  type: 'meeting' | 'call' | 'note' | 'task';
  title: string;
  description: string;
  created_at: string;
}

export interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  department_name: string;
  position: string;
  salary: number;
  leave_balance: number;
  status: 'Active' | 'On Leave' | 'Terminated';
}

export interface LeaveRequest {
  id: string;
  employee_name: string;
  leave_type: 'Annual' | 'Sick' | 'Casual';
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Product {
  id: string;
  code: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  quantity: number;
  selling_price: number;
  purchase_price: number;
  status: 'In Stock' | 'Out of Stock';
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  contact_person: string;
  capacity: number;
  current_utilization_pct: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  invoice_date: string;
  total_amount: number;
  paid_amount: number;
  status: 'Pending' | 'Paid' | 'Partially Paid';
}

export interface GlEntry {
  id: string;
  posting_date: string;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  voucher_type: string;
  voucher_id: string;
  remarks: string;
}
