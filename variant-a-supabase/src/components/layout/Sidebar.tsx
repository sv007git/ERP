import React from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  Users, 
  Package, 
  BadgeDollarSign, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';

export type NavTab = 'crm' | 'deals' | 'hrm' | 'inventory' | 'finance';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'crm' as NavTab, label: 'CRM Dashboard', icon: LayoutDashboard },
    { id: 'deals' as NavTab, label: 'Deals & Activities', icon: Flame, badge: 'Active' },
    { id: 'hrm' as NavTab, label: 'HRM Dashboard', icon: Users },
    { id: 'inventory' as NavTab, label: 'Inventory & Stock', icon: Package, count: 5 },
    { id: 'finance' as NavTab, label: 'Finance & Ledger', icon: BadgeDollarSign },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-lg mr-3 shadow-sm">
          ✦
        </div>
        <div className="font-bold text-white text-base tracking-wide flex items-center">
          Dreams ERP
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 text-xs">
        <div>
          <div className="px-3 mb-2 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
            Dashboards & Modules
          </div>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
            Platform Architecture
          </div>
          <div className="px-3 py-3 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[11px] space-y-2">
            <div className="flex items-center text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Variant A: Supabase
            </div>
            <div className="text-slate-400">
              PostgreSQL + Row Level Security (RLS) + TypeScript Client
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center">
          <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Falcon LLP
        </span>
        <span className="text-slate-400">v1.0.0</span>
      </div>
    </aside>
  );
};
