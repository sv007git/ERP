import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ChevronDown, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Package,
  Users,
  Flame,
  FolderKanban
} from 'lucide-react';
import { LocalErpStore } from '../../lib/supabase';

interface HeaderProps {
  currentOrg: string;
  onNavigateToTab?: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentOrg, onNavigateToTab }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [activeOrg, setActiveOrg] = useState(currentOrg);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      } else if (e.key === 'Escape') {
        setShowSearchModal(false);
        setShowNotifications(false);
        setShowOrgDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Search Results
  const allDeals = LocalErpStore.getDeals();
  const allProducts = LocalErpStore.getProducts();
  const allEmployees = LocalErpStore.getEmployees();
  const allProjects = LocalErpStore.getProjects();

  const filteredDeals = searchQuery.trim() 
    ? allDeals.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || (d.company_name && d.company_name.toLowerCase().includes(searchQuery.toLowerCase())))
    : [];

  const filteredProducts = searchQuery.trim() 
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredEmployees = searchQuery.trim() 
    ? allEmployees.filter(e => e.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || e.department_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredProjects = searchQuery.trim()
    ? allProjects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-xs">
      {/* Left: Organization Switcher & Search Bar */}
      <div className="flex items-center space-x-4">
        {/* Org Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            <span>{activeOrg}</span>
            <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
          </button>

          {showOrgDropdown && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs">
              {['Falcon LLP', 'Apex Global Corp', 'Nexora Enterprises'].map(org => (
                <button
                  key={org}
                  onClick={() => {
                    setActiveOrg(org);
                    setShowOrgDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 font-medium flex items-center justify-between hover:bg-slate-50 ${
                    activeOrg === org ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{org}</span>
                  {activeOrg === org && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar Input */}
        <div 
          onClick={() => setShowSearchModal(true)}
          className="relative hidden md:flex items-center cursor-pointer group"
        >
          <input
            type="text"
            readOnly
            placeholder="Search entities (Ctrl + K)..."
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-12 py-1.5 w-64 group-hover:border-slate-300 focus:outline-none transition cursor-pointer"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
          <kbd className="absolute right-2.5 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono font-semibold">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Theme Toggle & User Profile */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Moon className="w-4 h-4 text-emerald-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-bold text-slate-900">
                <span>Recent Notifications</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-[11px]">Low Stock Warning</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">Dyson Vacuum Cleaner is out of stock (0 units).</div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-[11px]">Deal Closed Won</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">CRM Subscription ($2.51M) marked Won by sales team.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                  <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-[11px]">Leave Request Pending</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">Maria Garcia requested 2 days casual leave.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            JA
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">Jamie Anderson</div>
            <div className="text-[10px] text-slate-400">Principal Administrator</div>
          </div>
        </div>
      </div>

      {/* Global Search Modal (Cmd+K) */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center space-x-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search deals, products, employees, projects..."
                className="w-full text-sm focus:outline-none text-slate-900"
              />
              <button 
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-4 space-y-4 text-xs">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-slate-400">
                  Type a name, code, or department to search across the entire ERP platform.
                </div>
              ) : (
                <>
                  {filteredDeals.length > 0 && (
                    <div>
                      <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center">
                        <Flame className="w-3 h-3 mr-1 text-orange-500" /> Deals & Opportunities
                      </div>
                      <div className="space-y-1">
                        {filteredDeals.map(d => (
                          <div 
                            key={d.id}
                            onClick={() => {
                              onNavigateToTab?.('deals');
                              setShowSearchModal(false);
                            }}
                            className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-slate-200"
                          >
                            <span className="font-semibold text-slate-800">{d.name} ({d.company_name})</span>
                            <span className="font-bold text-emerald-600">${d.deal_value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProducts.length > 0 && (
                    <div>
                      <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center">
                        <Package className="w-3 h-3 mr-1 text-teal-500" /> Products & Inventory
                      </div>
                      <div className="space-y-1">
                        {filteredProducts.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => {
                              onNavigateToTab?.('inventory');
                              setShowSearchModal(false);
                            }}
                            className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-slate-200"
                          >
                            <span className="font-semibold text-slate-800">{p.name} ({p.code})</span>
                            <span className="text-slate-500">{p.quantity} units • ${p.selling_price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredEmployees.length > 0 && (
                    <div>
                      <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center">
                        <Users className="w-3 h-3 mr-1 text-blue-500" /> Employees & Staff
                      </div>
                      <div className="space-y-1">
                        {filteredEmployees.map(e => (
                          <div 
                            key={e.id}
                            onClick={() => {
                              onNavigateToTab?.('hrm');
                              setShowSearchModal(false);
                            }}
                            className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-slate-200"
                          >
                            <span className="font-semibold text-slate-800">{e.full_name}</span>
                            <span className="text-slate-500">{e.position} • {e.department_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProjects.length > 0 && (
                    <div>
                      <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center">
                        <FolderKanban className="w-3 h-3 mr-1 text-purple-500" /> Projects & Initiatives
                      </div>
                      <div className="space-y-1">
                        {filteredProjects.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => {
                              onNavigateToTab?.('projects');
                              setShowSearchModal(false);
                            }}
                            className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-slate-200"
                          >
                            <span className="font-semibold text-slate-800">{p.name} ({p.code})</span>
                            <span className="text-slate-500">{p.progress}% • {p.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredDeals.length === 0 && filteredProducts.length === 0 && filteredEmployees.length === 0 && filteredProjects.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      No matching records found for "{searchQuery}".
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
