import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { PurchaseOrder } from '../types/database';
import { 
  Building2, 
  ShoppingBag, 
  Clock, 
  DollarSign, 
  Plus, 
  ChevronDown
} from 'lucide-react';

export const ProcurementPage: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => LocalErpStore.getPurchaseOrders());
  const [showAddPoModal, setShowAddPoModal] = useState(false);

  // Form states
  const [supplierName, setSupplierName] = useState('');
  const [category, setCategory] = useState('Raw Materials');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderedQty, setOrderedQty] = useState('5');
  const [deliveryDate, setDeliveryDate] = useState('2026-11-01');

  const handleAddPo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName || !orderAmount) return;

    LocalErpStore.createPurchaseOrder({
      supplier_name: supplierName,
      category: category,
      total_amount: parseFloat(orderAmount),
      ordered_qty: parseInt(orderedQty),
      order_date: new Date().toISOString().substring(0, 10),
      deliveryDate: deliveryDate
    } as any);

    setPurchaseOrders(LocalErpStore.getPurchaseOrders());
    setSupplierName('');
    setOrderAmount('');
    setShowAddPoModal(false);
  };

  const totalSpend = purchaseOrders.reduce((sum, p) => sum + p.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header matching 05_Procurement_Dashboard.jpg */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Procurement Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Supplier requisitions, vendor performance metrics, and purchase order tracking
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs">
            <span>Last 30 Days</span>
            <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
          </div>

          <button
            onClick={() => setShowAddPoModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Purchase Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Spend</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">${totalSpend.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Active Vendor Allocation
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Purchase Orders</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{purchaseOrders.length}</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">
              Contracted Orders
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">On Time Delivery</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">88%</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              Supplier SLA Benchmark
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Avg PO Value</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">$600</div>
            <div className="text-[11px] text-rose-600 font-semibold mt-1">
              Per Verified Purchase
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Top Suppliers & Spend Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Top Suppliers</h3>
            <span className="text-xs text-slate-400">2026 Allocation</span>
          </div>

          <div className="space-y-3.5">
            {[
              { name: 'Alpha Distributors', spend: '$50,000', pct: 95 },
              { name: 'Beta Industries', spend: '$42,000', pct: 80 },
              { name: 'Zenith Supplies', spend: '$36,000', pct: 68 },
              { name: 'Orion Equipments', spend: '$25,000', pct: 48 },
              { name: 'Stellar Tools', spend: '$20,000', pct: 38 }
            ].map((sup, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{sup.name}</span>
                  <span className="text-slate-500">{sup.spend}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div style={{ width: `${sup.pct}%` }} className="h-full bg-teal-600 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Spend by Category</h3>
            <span className="text-xs text-slate-400">Monthly</span>
          </div>

          <div className="flex items-center justify-center p-6">
            <div className="relative w-44 h-44 rounded-full border-8 border-teal-500 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-slate-900">42%</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Clothing</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-4 border-t border-slate-100">
            <div>
              <div className="font-bold text-slate-900">42%</div>
              <div className="text-[10px] text-slate-500">Clothing</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">38%</div>
              <div className="text-[10px] text-slate-500">Beauty Products</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">20%</div>
              <div className="text-[10px] text-slate-500">Electronics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Procurement Activity Table matching 05_Procurement_Dashboard.jpg */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Procurement Activity</h3>
          <span className="text-xs text-slate-400">Order verification log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Purchase ID</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Ordered Qty</th>
                <th className="py-3 px-4">Delivered Qty</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{po.po_number}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{po.supplier_name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{po.category}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{po.ordered_qty}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{po.delivered_qty}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">${po.total_amount}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      po.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Purchase Order */}
      {showAddPoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create Purchase Order</h3>
            <form onSubmit={handleAddPo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Name</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={e => setSupplierName(e.target.value)}
                  placeholder="e.g. Acme Components LLC"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="IT Equipment">IT Equipment</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Amount ($)</label>
                  <input
                    type="number"
                    value={orderAmount}
                    onChange={e => setOrderAmount(e.target.value)}
                    placeholder="e.g. 850"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={orderedQty}
                    onChange={e => setOrderedQty(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPoModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
