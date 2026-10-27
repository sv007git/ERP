import React from 'react';
import { Search, Bell, Sun, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentOrg: string;
}

export const Header: React.FC<HeaderProps> = ({ currentOrg }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      {/* Left: Organization Switcher & Search */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          {currentOrg}
          <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
        </div>

        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search (Ctrl + K)..."
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-12 py-1.5 w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <kbd className="absolute right-2.5 top-2 text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Theme Toggle & User Profile */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
          <Sun className="w-4 h-4" />
        </button>

        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5"></span>
        </button>

        <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            JA
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">Jamie Anderson</div>
            <div className="text-[10px] text-slate-400">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};
