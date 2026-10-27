import { useState } from 'react';
import { Sidebar, type NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CrmDashboard } from './pages/CrmDashboard';
import { DealsPage } from './pages/DealsPage';
import { HrmDashboard } from './pages/HrmDashboard';
import { InventoryDashboard } from './pages/InventoryDashboard';
import { FinancePage } from './pages/FinancePage';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('crm');
  const [selectedDealId, setSelectedDealId] = useState<string>('del-020');

  const handleSelectDeal = (id: string) => {
    setSelectedDealId(id);
    setActiveTab('deals');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header currentOrg="Falcon LLP" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'crm' && (
            <CrmDashboard onSelectDeal={handleSelectDeal} />
          )}

          {activeTab === 'deals' && (
            <DealsPage
              dealId={selectedDealId}
              onBack={() => setActiveTab('crm')}
            />
          )}

          {activeTab === 'hrm' && (
            <HrmDashboard />
          )}

          {activeTab === 'inventory' && (
            <InventoryDashboard />
          )}

          {activeTab === 'finance' && (
            <FinancePage />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
