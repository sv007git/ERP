import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Product } from '../types/database';
import { Package, TrendingUp, Warehouse as WarehouseIcon, Plus, ArrowUpRight } from 'lucide-react';

export const InventoryDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(LocalErpStore.getProducts());
  const [receivedMessage, setReceivedMessage] = useState<string | null>(null);

  const handleReceiveStock = (productId: string) => {
    const updated = LocalErpStore.adjustStock(productId, 10);
    setProducts(prev => prev.map(p => p.id === productId ? updated : p));
    setReceivedMessage(`Received +10 units of ${updated.name}. New quantity: ${updated.quantity}`);
    setTimeout(() => setReceivedMessage(null), 4000);
  };

  const totalQuantity = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.quantity * p.purchase_price), 0);

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Inventory Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Multi-warehouse stock levels, SKU tracking, and inventory valuation.</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-medium">
            Last 30 Days
          </span>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-sm flex items-center transition">
            <Plus className="w-3.5 h-3.5 mr-1" />
            + Add Inventory
          </button>
        </div>
      </div>

      {receivedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between">
          <span>{receivedMessage}</span>
          <span className="text-[10px] text-emerald-600">Stock Ledger Entry Appended</span>
        </div>
      )}

      {/* KPI Cards & Warehouse Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Stock</span>
            <Package className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{totalQuantity} units</div>
            <div className="flex items-center mt-2 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +5.43% from last week
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Inventory Value</span>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">${totalValue.toLocaleString()}</div>
            <div className="text-slate-400 text-xs mt-2">Valuation Cost: Moving Average</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Warehouse Utilization</span>
            <WarehouseIcon className="w-5 h-5 text-sky-500" />
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-slate-700">Smart Stock Hub</span>
                <span className="font-bold text-emerald-600">85% Capacity</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-[85%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-slate-700">Flow Grid Storage</span>
                <span className="font-bold text-amber-600">75% Capacity</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full w-[75%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stocks Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-slate-800">Recent Stocks</h4>
          <span className="text-xs text-slate-400">Real-time Stock Tracking</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Selling Price</th>
                <th className="py-2.5 px-3">Purchase Price</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-semibold text-slate-900">{p.code}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{p.name}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{p.sku}</td>
                  <td className="py-3 px-3">{p.category}</td>
                  <td className="py-3 px-3">{p.unit}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{p.quantity}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">${p.selling_price.toFixed(2)}</td>
                  <td className="py-3 px-3 text-slate-500">${p.purchase_price.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      p.status === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleReceiveStock(p.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                    >
                      + Receive 10
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
