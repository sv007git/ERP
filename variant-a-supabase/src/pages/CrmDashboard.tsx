import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Lead, Deal } from '../types/database';
import { Users, CheckCircle, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CrmDashboardProps {
  onSelectDeal: (dealId: string) => void;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({ onSelectDeal }) => {
  const [leads] = useState<Lead[]>(LocalErpStore.getLeads());
  const [deals] = useState<Deal[]>(LocalErpStore.getDeals());

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">CRM Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Overview of pipeline velocity, active leads, and revenue metrics.</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-medium">
            Last 30 Days
          </span>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-sm transition">
            Export Report
          </button>
        </div>
      </div>

      {/* 4-Card KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Leads */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Leads</span>
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">$125,000</h3>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center mr-2">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +12.4%
              </span>
              <span className="text-slate-400">from last week</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Deals Closed */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Deals Closed</span>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">$154,000</h3>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center mr-2">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +5.3%
              </span>
              <span className="text-slate-400">from last week</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Opportunities */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Opportunities</span>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">$185,000</h3>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-rose-500 font-semibold flex items-center mr-2">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -4.35%
              </span>
              <span className="text-slate-400">from last week</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">$210,000</h3>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center mr-2">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +11.8%
              </span>
              <span className="text-slate-400">from last week</span>
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
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
              View All
            </span>
          </div>
          <div className="divide-y divide-slate-100">
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
            <span className="text-xs text-slate-400">Interactive Pipeline</span>
          </div>
          <div className="divide-y divide-slate-100">
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
    </div>
  );
};
