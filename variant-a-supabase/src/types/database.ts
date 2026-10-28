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
  address?: string;
  stage: DealStage;
  probability: number;
  deal_value: number;
  status: 'Open' | 'Won' | 'Lost';
  priority: 'Low' | 'Medium' | 'High';
  source?: string;
  due_date: string | null;
  follow_up_date?: string;
  tags?: string[];
  projects?: string[];
  owners?: string[];
  contacts?: string[];
  last_modified?: string;
  modified_by?: string;
  created_at: string;
}

export interface DealActivity {
  id: string;
  deal_id: string;
  user_name: string;
  type: 'activity' | 'meeting' | 'call' | 'note' | 'task' | 'file' | 'email';
  title: string;
  description: string;
  created_at: string;
  date_group?: string;
  priority?: 'Low' | 'Medium' | 'High';
  reminder?: string;
  assigned_to?: string;
  file_name?: string;
  file_size?: string;
  call_outcome?: string;
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
  brand?: string;
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
  items?: { description: string; quantity: number; unit_price: number }[];
}

export interface SalesOrder {
  id: string;
  order_number: string;
  customer_name: string;
  order_date: string;
  total_amount: number;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered';
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_name: string;
  category: string;
  order_date: string;
  delivery_date: string;
  total_amount: number;
  ordered_qty: number;
  delivered_qty: number;
  status: 'Delivered' | 'In Transit' | 'Pending' | 'Partially Delivered';
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  progress: number;
  team_leader: string;
  team_members: string[];
  deadline: string;
  status: 'In Progress' | 'Completed' | 'Pending';
}

export interface Ticket {
  id: string;
  code: string;
  customer_name: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
  assigned_to: string;
  created_at: string;
  last_updated: string;
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
