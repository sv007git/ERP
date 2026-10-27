import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Lead, Deal } from '../types/database';
import { Users, CheckCircle, TrendingUp, DollarSign, ArrowUpRight, Plus, X } from 'lucide-react';

interface CrmDashboardProps {
  onSelectDeal: (dealId: string) => void;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({ onSelectDeal }) => {
  const [leads, setLeads] = useState<Lead[]>(() => LocalErpStore.getLeads());
  const [deals, setDeals] = useState<Deal[]>(() => LocalErpStore.getDeals());

  // Modals state
  const [showAddLead, setShowAddLead] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);

  // New Lead fields
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadSource, setLeadSource] = useState('Organic Search');
  const [leadStatus, setLeadStatus] = useState<'Closed' | 'Not Closed' | 'Contacted' | 'Lost'>('Contacted');

  // New Deal fields
  const [dealName, setDealName] = useState('');
  const [dealCompany, setDealCompany] = useState('');
  const [dealValue, setDealValue] = useState('50000');
  const [dealStage, setDealStage] = useState<'Qualify To Buy' | 'Contact Made' | 'Presentation' | 'Proposal Made' | 'Appointment' | 'Won'>('Contact Made');
  const [dealPriority, setDealPriority] = useState<'Low' | 'Medium' | 'High'>('High');

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) return;
    LocalErpStore.addLead({
      name: leadName.trim(),
      company_name: leadCompany.trim() || null,
      source: leadSource,
      status: leadStatus
    });
    setLeads([...LocalErpStore.getLeads()]);
    setLeadName('');
    setLeadCompany('');
    setShowAddLead(false);
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealName.trim()) return;
    const val = parseFloat(dealValue) || 10000;
    const stageProbabilities: Record<string, number> = {
      'Qualify To Buy': 20,
      'Contact Made': 40,
      'Presentation': 60,
      'Proposal Made': 80,
      'Appointment': 90,
      'Won': 100
    };
    LocalErpStore.addDeal({
      name: dealName.trim(),
      company_name: dealCompany.trim() || null,
      deal_value: val,
      stage: dealStage,
      probability: stageProbabilities[dealStage] || 50,
      status: dealStage === 'Won' ? 'Won' : 'Open',
      priority: dealPriority,
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10)
    });
    setDeals([...LocalErpStore.getDeals()]);
    setDealName('');
    setDealCompany('');
    setShowAddDeal(false);
  };

  const totalWonRevenue = deals.filter(d => d.status === 'Won').reduce((sum, d) => sum + d.deal_value, 0);
  const totalPipelineValue = deals.reduce((sum, d) => sum + d.deal_value, 0);

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">CRM Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Overview of pipeline velocity, active leads, and revenue metrics.</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setShowAddLead(true)}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3.5 py-2 rounded-lg shadow-xs flex items-center transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-slate-500" />
            + Add Lead
          </button>
          <button
            onClick={() => setShowAddDeal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            + New Deal
          </button>
        </div>
      </div>

      {/* 4-Card KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Leads</span>
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{leads.length} Leads</h3>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center mr-2">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +12.4%
              </span>
              <span className="text-slate-400">from last week</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Deals Value</span>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">${totalPipelineValue.toLocaleString()}</h3>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center mr-2">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> {deals.length} active deals
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pipeline Stages</span>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">
              {deals.filter(d => d.status === 'Open').length} In Progress
            </h3>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-slate-400">Weighted conversion 68%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Closed Won Revenue</span>
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">${totalWonRevenue.toLocaleString()}</h3>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center mr-2">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +11.8%
              </span>
              <span className="text-slate-400">settled revenue</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Recent Leads & Recent Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-base font-semibold text-slate-800">Recent Leads</h4>
            <button
              onClick={() => setShowAddLead(true)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center"
            >
              <Plus className="w-3.5 h-3.5 mr-0.5" /> Add Lead
            </button>
          </div>
          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {leads.map((l) => {
              const badgeStyle = {
                'Closed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'Not Closed': 'bg-amber-50 text-amber-700 border-amber-200',
                'Contacted': 'bg-purple-50 text-purple-700 border-purple-200',
                'Lost': 'bg-rose-50 text-rose-700 border-rose-200',
              }[l.status] || 'bg-slate-100 text-slate-700 border-slate-200';

              return (
                <div key={l.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {l.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{l.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {l.code} • {l.company_name || 'Direct Client'} • {l.source}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
                    {l.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Deals */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-base font-semibold text-slate-800">Recent Deals</h4>
            <button
              onClick={() => setShowAddDeal(true)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center"
            >
              <Plus className="w-3.5 h-3.5 mr-0.5" /> Add Deal
            </button>
          </div>
          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {deals.map((d) => (
              <div 
                key={d.id} 
                onClick={() => onSelectDeal(d.id)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer rounded-lg px-2 transition"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 flex items-center">
                    {d.name}
                    <span className="ml-2 text-[10px] text-slate-400">{d.code}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Stage: <strong className="text-slate-700">{d.stage}</strong> ({d.probability}%)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">
                    ${d.deal_value.toLocaleString()}
                  </div>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full font-medium border ${
                    d.status === 'Won' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : (d.status === 'Lost' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-sky-50 text-sky-700 border-sky-200')
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add New Lead */}
      {showAddLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Lead</h3>
              <button onClick={() => setShowAddLead(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lead Name *</label>
                <input
                  type="text"
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  placeholder="e.g. John Miller"
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  value={leadCompany}
                  onChange={e => setLeadCompany(e.target.value)}
                  placeholder="e.g. Acme Tech"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source</label>
                  <select
                    value={leadSource}
                    onChange={e => setLeadSource(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Organic Search">Organic Search</option>
                    <option value="Campaigns">Campaigns</option>
                    <option value="Referral">Referral</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={leadStatus}
                    onChange={e => setLeadStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Contacted">Contacted</option>
                    <option value="Not Closed">Not Closed</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLead(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Deal */}
      {showAddDeal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New Deal</h3>
              <button onClick={() => setShowAddDeal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDeal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  value={dealName}
                  onChange={e => setDealName(e.target.value)}
                  placeholder="e.g. Cloud Security Audit"
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Company</label>
                <input
                  type="text"
                  value={dealCompany}
                  onChange={e => setDealCompany(e.target.value)}
                  placeholder="e.g. Nexora Inc"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deal Value ($ USD) *</label>
                <input
                  type="number"
                  value={dealValue}
                  onChange={e => setDealValue(e.target.value)}
                  placeholder="50000"
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stage</label>
                  <select
                    value={dealStage}
                    onChange={e => setDealStage(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Qualify To Buy">Qualify To Buy</option>
                    <option value="Contact Made">Contact Made</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Proposal Made">Proposal Made</option>
                    <option value="Appointment">Appointment</option>
                    <option value="Won">Won</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={dealPriority}
                    onChange={e => setDealPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDeal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
