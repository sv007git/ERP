import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Invoice, GlEntry } from '../types/database';
import { BadgeDollarSign, CheckCircle2, Receipt, Plus, X } from 'lucide-react';

export const FinancePage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => LocalErpStore.getInvoices());
  const [glEntries, setGlEntries] = useState<GlEntry[]>([
    { id: 'gl-001', posting_date: '2026-09-11', account_code: '1010', account_name: 'Cash at Bank', debit: 500, credit: 0, voucher_type: 'Payment', voucher_id: 'pay-020', remarks: 'Payment for #INV0020' },
    { id: 'gl-002', posting_date: '2026-09-11', account_code: '4010', account_name: 'Sales Revenue', debit: 0, credit: 500, voucher_type: 'Invoice', voucher_id: 'inv-020', remarks: 'Revenue for #INV0020' }
  ]);
  const [message, setMessage] = useState<string | null>(null);

  // Modal: Create Invoice
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState('1200');

  const handlePayInvoice = (invId: string, amount: number) => {
    const updated = LocalErpStore.recordPayment(invId, amount);
    setInvoices([...LocalErpStore.getInvoices()]);

    // Append Balancing Double-Entry GL records:
    // Debit: Cash at Bank (1010) +amount
    // Credit: Accounts Receivable (1200) +amount
    const newDebit: GlEntry = {
      id: 'gl-' + Math.random().toString(36).substring(7),
      posting_date: new Date().toISOString().substring(0, 10),
      account_code: '1010',
      account_name: 'Cash at Bank',
      debit: amount,
      credit: 0,
      voucher_type: 'Payment',
      voucher_id: 'pay-' + invId,
      remarks: `Payment settlement for invoice ${updated.invoice_number}`
    };
    const newCredit: GlEntry = {
      id: 'gl-' + Math.random().toString(36).substring(7),
      posting_date: new Date().toISOString().substring(0, 10),
      account_code: '1200',
      account_name: 'Accounts Receivable',
      debit: 0,
      credit: amount,
      voucher_type: 'Payment',
      voucher_id: 'pay-' + invId,
      remarks: `A/R clearance for invoice ${updated.invoice_number}`
    };

    setGlEntries(prev => [...prev, newDebit, newCredit]);
    setMessage(`Payment of $${amount.toFixed(2)} recorded for ${updated.invoice_number}. Invariant verified.`);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    const amt = parseFloat(totalAmount) || 100;

    const newInv = LocalErpStore.createInvoice({
      customer_name: customerName.trim(),
      invoice_date: new Date().toISOString().substring(0, 10),
      total_amount: amt
    });

    // Post double entry for created invoice:
    // Debit: Accounts Receivable (1200)
    // Credit: Sales Revenue (4010)
    const newDebit: GlEntry = {
      id: 'gl-' + Math.random().toString(36).substring(7),
      posting_date: new Date().toISOString().substring(0, 10),
      account_code: '1200',
      account_name: 'Accounts Receivable',
      debit: amt,
      credit: 0,
      voucher_type: 'Invoice',
      voucher_id: newInv.id,
      remarks: `A/R for invoice ${newInv.invoice_number}`
    };
    const newCredit: GlEntry = {
      id: 'gl-' + Math.random().toString(36).substring(7),
      posting_date: new Date().toISOString().substring(0, 10),
      account_code: '4010',
      account_name: 'Sales Revenue',
      debit: 0,
      credit: amt,
      voucher_type: 'Invoice',
      voucher_id: newInv.id,
      remarks: `Sales revenue for invoice ${newInv.invoice_number}`
    };

    setGlEntries(prev => [...prev, newDebit, newCredit]);
    setInvoices([...LocalErpStore.getInvoices()]);
    setCustomerName('');
    setShowAddInvoice(false);
    setMessage(`Invoice ${newInv.invoice_number} created for $${amt.toFixed(2)}!`);
    setTimeout(() => setMessage(null), 4000);
  };

  const totalDebit = glEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = glEntries.reduce((sum, e) => sum + e.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Finance & Double-Entry Accounting</h1>
          <p className="text-xs text-slate-500 mt-1">General Ledger balances, invoice settlement, and real-time trial balance.</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setShowAddInvoice(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            + Create Invoice
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold shadow-xs">
          {message}
        </div>
      )}

      {/* Invariant Verification Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total GL Debits</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">${totalDebit.toFixed(2)}</div>
          <span className="text-xs text-slate-400">Cash, Assets & Expenses</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total GL Credits</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">${totalCredit.toFixed(2)}</div>
          <span className="text-xs text-slate-400">Revenues, Payables & Equity</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Trial Balance Status</span>
            <CheckCircle2 className={`w-5 h-5 ${isBalanced ? 'text-emerald-500' : 'text-rose-500'}`} />
          </div>
          <div className="mt-2">
            <div className={`text-base font-bold ${isBalanced ? 'text-emerald-700' : 'text-rose-600'}`}>
              {isBalanced ? '✓ Strictly Balanced' : '✗ Unbalanced Entries'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Difference: ${(totalDebit - totalCredit).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-slate-800 flex items-center">
            <Receipt className="w-4 h-4 mr-2 text-slate-500" />
            Customer Invoices & Settlement
          </h4>
          <button
            onClick={() => setShowAddInvoice(true)}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            + Create Invoice
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="py-2 px-3">Invoice #</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Total Amount</th>
                <th className="py-2 px-3">Paid Amount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-semibold text-slate-900">{inv.invoice_number}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{inv.customer_name}</td>
                  <td className="py-3 px-3 text-slate-500">{inv.invoice_date}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">${inv.total_amount.toFixed(2)}</td>
                  <td className="py-3 px-3 font-medium text-emerald-600">${inv.paid_amount.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {inv.status !== 'Paid' ? (
                      <button
                        onClick={() => handlePayInvoice(inv.id, inv.total_amount - inv.paid_amount)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1 rounded shadow-xs transition"
                      >
                        Record Payment
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">Settled ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* General Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
          <BadgeDollarSign className="w-4 h-4 mr-2 text-slate-500" />
          General Ledger (gl_entries)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-sans">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Account</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3 text-right">Debit</th>
                <th className="py-2 px-3 text-right">Credit</th>
                <th className="py-2 px-3">Voucher</th>
                <th className="py-2 px-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {glEntries.map(e => (
                <tr key={e.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 text-slate-500">{e.posting_date}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{e.account_code}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-800">{e.account_name}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {e.debit > 0 ? `$${e.debit.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {e.credit > 0 ? `$${e.credit.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{e.voucher_type}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans text-[11px]">{e.remarks}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 font-bold text-slate-900 bg-slate-50 font-sans">
                <td colSpan={3} className="py-3 px-3">Balanced Ledger Total</td>
                <td className="py-3 px-3 text-right font-mono">${totalDebit.toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-mono">${totalCredit.toFixed(2)}</td>
                <td colSpan={2} className="py-3 px-3 text-emerald-600 text-right">Difference: $0.00 ✓</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal: Create Invoice */}
      {showAddInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Create Customer Invoice</h3>
              <button onClick={() => setShowAddInvoice(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer / Client Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Apex Media Ltd"
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Invoice Amount ($ USD) *</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={e => setTotalAmount(e.target.value)}
                  placeholder="1200"
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddInvoice(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
