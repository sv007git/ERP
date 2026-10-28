import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Invoice, SalesOrder } from '../types/database';
import { 
  TrendingUp, 
  FileText, 
  ShoppingCart, 
  Users, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Printer,
  ChevronDown
} from 'lucide-react';

export const SalesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => LocalErpStore.getInvoices());
  const [salesOrders] = useState<SalesOrder[]>(() => LocalErpStore.getSalesOrders());
  const [timeHorizon, setTimeHorizon] = useState<'1D' | '7D' | '1M' | '1Y'>('1M');
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().substring(0, 10));

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !invoiceAmount) return;

    LocalErpStore.createInvoice({
      customer_name: customerName,
      total_amount: parseFloat(invoiceAmount),
      invoice_date: invoiceDate
    });

    setInvoices(LocalErpStore.getInvoices());
    setCustomerName('');
    setInvoiceAmount('');
    setShowCreateInvoiceModal(false);
  };

  const handleRecordPayment = (invId: string, amount: number) => {
    LocalErpStore.recordPayment(invId, amount);
    setInvoices(LocalErpStore.getInvoices());
  };

  const revenueTotal = invoices.reduce((sum, i) => sum + i.paid_amount, 0);
  const openInvoicesCount = invoices.filter(i => i.status !== 'Paid').length;

  return (
    <div className="space-y-6">
      {/* Top Header matching 07_Sales_Dashboard.jpg */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sales Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time accounts receivable, revenue velocity, and sales order fulfillment
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs">
            <span>Last 30 Days</span>
            <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
          </div>

          <button
            onClick={() => setShowCreateInvoiceModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Revenue</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">${(revenueTotal / 1000).toFixed(1)}K</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.2% vs last month
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Open Invoices</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{openInvoicesCount}</div>
            <div className="text-[11px] text-amber-600 font-semibold flex items-center mt-1">
              <Clock className="w-3 h-3 mr-0.5" /> Pending Settlement
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Open Orders</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{salesOrders.length}</div>
            <div className="text-[11px] text-blue-600 font-semibold flex items-center mt-1">
              <CheckCircle2 className="w-3 h-3 mr-0.5" /> Active Fulfillment
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">New Customers</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">378</div>
            <div className="text-[11px] text-purple-600 font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +28 this week
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid: Revenue Trends + Sales by Region */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trends Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Revenue Trends</h3>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {(['1D', '7D', '1M', '1Y'] as const).map(horizon => (
                <button
                  key={horizon}
                  onClick={() => setTimeHorizon(horizon)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    timeHorizon === horizon ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {horizon}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-4 border-b border-slate-100">
            {[
              { month: 'Jan', val: 38 },
              { month: 'Feb', val: 22 },
              { month: 'Mar', val: 54 },
              { month: 'Apr', val: 24 },
              { month: 'May', val: 56 },
              { month: 'Jun', val: 85, highlight: true },
              { month: 'Jul', val: 42 },
              { month: 'Aug', val: 24 },
              { month: 'Sep', val: 68 },
              { month: 'Oct', val: 78 },
              { month: 'Nov', val: 38 },
              { month: 'Dec', val: 22 }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                {bar.highlight && (
                  <span className="text-[10px] font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded mb-1 shadow-xs">
                    $85K
                  </span>
                )}
                <div
                  style={{ height: `${bar.val}%` }}
                  className={`w-full max-w-[32px] rounded-t-md transition-all duration-300 ${
                    bar.highlight ? 'bg-amber-600' : 'bg-amber-100 group-hover:bg-amber-300'
                  }`}
                />
                <span className="text-[10px] text-slate-400 mt-2 font-medium">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Region (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Sales by Region</h3>
              <span className="text-xs text-slate-400">2026</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 mb-4">
              <div className="text-xs font-bold text-slate-700">Australia Territory</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-500">Sales Revenue</span>
                <span className="text-sm font-bold text-slate-900">$650K</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-slate-500">Contribution</span>
                <span className="text-sm font-bold text-emerald-600">43%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-900 text-white">
            <div className="text-2xl font-extrabold">$2.4M</div>
            <div className="text-xs text-emerald-200 mt-0.5">Global Sales vs Last Month</div>
            <div className="flex items-center gap-1 mt-3">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i < 16 ? 'bg-emerald-400' : 'bg-emerald-800'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales Activity Table matching 07_Sales_Dashboard.jpg */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Sales Activity</h3>
          <span className="text-xs text-slate-400">All posted transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{inv.invoice_number}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">Invoice</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{inv.customer_name}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">${inv.total_amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.invoice_date}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {inv.status !== 'Paid' && (
                      <button
                        onClick={() => handleRecordPayment(inv.id, inv.total_amount - inv.paid_amount)}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700"
                      >
                        Settle Paid
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Printing Invoice ${inv.invoice_number}...`)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                      title="Print Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Invoice */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create Customer Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Acorn Retail Ltd"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Amount ($)</label>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={e => setInvoiceAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={e => setInvoiceDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs"
                >
                  Save & Post Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
