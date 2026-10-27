import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Product } from '../types/database';
import { Package, TrendingUp, Warehouse as WarehouseIcon, Plus, ArrowUpRight, X } from 'lucide-react';

export const InventoryDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => LocalErpStore.getProducts());
  const [receivedMessage, setReceivedMessage] = useState<string | null>(null);

  // Add Product modal
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Smartphones');
  const [sellingPrice, setSellingPrice] = useState('299');
  const [purchasePrice, setPurchasePrice] = useState('250');
  const [quantity, setQuantity] = useState('10');

  const handleReceiveStock = (productId: string) => {
    const updated = LocalErpStore.adjustStock(productId, 10);
    setProducts([...LocalErpStore.getProducts()]);
    setReceivedMessage(`Received +10 units of ${updated.name}. New quantity: ${updated.quantity}`);
    setTimeout(() => setReceivedMessage(null), 4000);
  };

  const handleReduceStock = (productId: string) => {
    try {
      const prod = products.find(p => p.id === productId);
      if (!prod || prod.quantity < 5) {
        setReceivedMessage(`Cannot reduce below 0. Current quantity: ${prod?.quantity || 0}`);
        setTimeout(() => setReceivedMessage(null), 3000);
        return;
      }
      const updated = LocalErpStore.adjustStock(productId, -5);
      setProducts([...LocalErpStore.getProducts()]);
      setReceivedMessage(`Dispatched -5 units of ${updated.name}. Remaining: ${updated.quantity}`);
      setTimeout(() => setReceivedMessage(null), 4000);
    } catch (e: any) {
      setReceivedMessage(e.message);
      setTimeout(() => setReceivedMessage(null), 3000);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const qty = parseInt(quantity) || 0;
    const sell = parseFloat(sellingPrice) || 0;
    const buy = parseFloat(purchasePrice) || 0;

    LocalErpStore.addProduct({
      name: name.trim(),
      sku: sku.trim() || ('SKU-' + Math.floor(1000 + Math.random() * 9000)),
      category,
      unit: 'Piece',
      quantity: qty,
      selling_price: sell,
      purchase_price: buy,
      status: qty > 0 ? 'In Stock' : 'Out of Stock'
    });

    setProducts([...LocalErpStore.getProducts()]);
    setName('');
    setSku('');
    setShowAddProduct(false);
    setReceivedMessage(`Product ${name.trim()} added successfully!`);
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
          <button
            onClick={() => setShowAddProduct(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            + Add Product
          </button>
        </div>
      </div>

      {receivedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs">
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
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Across {products.length} catalog items
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
          <span className="text-xs text-slate-400">{products.length} Products Tracked</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Selling Price</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Quick Stock Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-semibold text-slate-900">{p.code}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{p.name}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{p.sku}</td>
                  <td className="py-3 px-3">{p.category}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{p.quantity}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">${p.selling_price.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      p.status === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5">
                    <button
                      onClick={() => handleReceiveStock(p.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded transition"
                    >
                      + Receive 10
                    </button>
                    <button
                      onClick={() => handleReduceStock(p.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded transition"
                    >
                      - Dispatch 5
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Product */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Product</h3>
              <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. MacBook Pro M3"
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="e.g. MAC-M3-16"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Smartphones">Smartphones</option>
                    <option value="Computers">Computers</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Appliances">Appliances</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qty</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling ($)</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={e => setSellingPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost ($)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={e => setPurchasePrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
