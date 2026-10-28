import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Deal, DealActivity, DealStage } from '../types/database';
import { DealPipeline } from '../components/crm/DealPipeline';
import { ActivityTimeline } from '../components/crm/ActivityTimeline';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Shield, 
  Plus 
} from 'lucide-react';

interface DealsPageProps {
  dealId?: string;
  onBack: () => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ dealId = 'del-020', onBack }) => {
  const [deal, setDeal] = useState<Deal>(() => LocalErpStore.getDeal(dealId) || LocalErpStore.getDeals()[0]);
  const [activities, setActivities] = useState<DealActivity[]>(() => LocalErpStore.getActivities(deal.id));
  const [priority, setPriority] = useState<Deal['priority']>(deal.priority || 'High');
  const [dealStatus, setDealStatus] = useState<Deal['status']>(deal.status || 'Won');

  const handleAdvanceStage = (newStage: DealStage) => {
    const stageProbabilities: Record<DealStage, number> = {
      'Qualify To Buy': 20,
      'Contact Made': 40,
      'Presentation': 60,
      'Proposal Made': 80,
      'Appointment': 90,
      'Won': 100,
      'Lost': 0
    };
    const updated = LocalErpStore.updateDealStage(deal.id, newStage, stageProbabilities[newStage]);
    setDeal(updated);

    const newAct = LocalErpStore.addActivity(deal.id, {
      title: `Pipeline Stage Advanced to ${newStage}`,
      description: `Win probability updated to ${stageProbabilities[newStage]}% based on pipeline stage transition.`,
      type: 'note',
      user_name: 'Jamie Anderson',
      date_group: 'Today'
    });
    setActivities(prev => [newAct, ...prev]);
  };

  const handleStatusChange = (newStatus: 'Open' | 'Won' | 'Lost') => {
    setDealStatus(newStatus);
    const updated = LocalErpStore.updateDealStatus(deal.id, newStatus);
    setDeal(updated);

    const newAct = LocalErpStore.addActivity(deal.id, {
      title: `Deal Status marked as ${newStatus}`,
      description: `Opportunity closed as ${newStatus} by sales lead.`,
      type: 'activity',
      user_name: 'Jamie Anderson',
      date_group: 'Today'
    });
    setActivities(prev => [newAct, ...prev]);
  };

  const handleAddActivity = (actData: Omit<DealActivity, 'id' | 'deal_id' | 'created_at'>) => {
    const newAct = LocalErpStore.addActivity(deal.id, actData);
    setActivities(prev => [newAct, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation matching 08_Deals_Activities.jpg */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 font-bold text-slate-800 hover:text-emerald-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Deals</span>
        </button>
      </div>

      {/* Main Deal Header Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full border-2 border-orange-200 bg-orange-50 text-orange-600 font-extrabold text-lg flex items-center justify-center shrink-0">
            CR
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900">{deal.name}</h1>
              <span className="flex items-center text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                <Shield className="w-3 h-3 mr-1 text-slate-400" /> Private
              </span>

              {/* Status Select Dropdown matching Won v button */}
              <select
                value={dealStatus}
                onChange={e => handleStatusChange(e.target.value as any)}
                className={`text-xs font-bold px-2.5 py-1 rounded-md border cursor-pointer focus:outline-none ${
                  dealStatus === 'Won'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : dealStatus === 'Lost'
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : 'bg-sky-50 text-sky-700 border-sky-300'
                }`}
              >
                <option value="Open">Open</option>
                <option value="Won">Won ∨</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center font-semibold text-slate-700">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" /> {deal.company_name || 'Nexora'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {deal.address || '22, Ave Street, Newyork, USA'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Opportunity Value</span>
          <span className="text-2xl font-extrabold text-slate-900">
            ${deal.deal_value.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            Win Probability: {deal.probability}%
          </span>
        </div>
      </div>

      {/* Main Grid: Left Column Deal Info + Right Column Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Deal Information & Metadata (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Deal Information
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Date Created</span>
                <span className="font-semibold text-slate-800">{deal.created_at || '10 Sep 2025, 10:30 AM'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Probability</span>
                <span className="font-bold text-emerald-600">Win – {deal.probability}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Deal Value</span>
                <span className="font-extrabold text-slate-900">${deal.deal_value.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Due Date</span>
                <span className="font-semibold text-slate-800">{deal.due_date || '27 Sep 2025, 11:00 AM'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Follow Up</span>
                <span className="font-semibold text-slate-800">{deal.follow_up_date || '27 Sep 2025'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Source</span>
                <span className="font-semibold text-slate-800">{deal.source || 'Paid Campaign'}</span>
              </div>
            </div>

            {/* Deal Owner */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900">Deal Owner</span>
                <button 
                  onClick={() => alert('Add collaborator modal')}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
                >
                  <Plus className="w-3 h-3 mr-0.5" /> Add New
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center">
                    RC
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Robert Cosper</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-900 mb-2">Tags</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold text-[11px] rounded-md border border-emerald-200">
                  Collab
                </span>
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-semibold text-[11px] rounded-md border border-purple-200">
                  VIP
                </span>
              </div>
            </div>

            {/* Priority */}
            <div className="pt-4 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-900 mb-1.5">Priority</span>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-slate-800"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Associated Projects */}
            <div className="pt-4 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-900 mb-2">Projects</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-medium text-[11px] rounded-md">
                  Dreams Food
                </span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-medium text-[11px] rounded-md">
                  Craftesty
                </span>
              </div>
            </div>

            {/* Contacts */}
            <div className="pt-4 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-900 mb-2.5">Contacts</span>
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center">
                  RC
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Robert Cosper</div>
                  <div className="text-[10px] text-slate-400">Primary Contact</div>
                </div>
              </div>
            </div>

            {/* Last Modified */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-700">Last Modified</span>
                <div className="text-slate-400">{deal.last_modified || '15 Sep 2025, 04:10 PM'}</div>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-[9px] flex items-center justify-center">
                  RC
                </div>
                <span className="font-medium text-slate-700">Robert Cosper</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pipeline Status & Tabbed Collaboration Center (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chevron Pipeline Bar */}
          <DealPipeline
            currentStage={deal.stage}
            onAdvanceStage={handleAdvanceStage}
          />

          {/* Tabbed Activity / Notes / Calls / Files / Email Center */}
          <ActivityTimeline
            dealId={deal.id}
            activities={activities}
            onAddActivity={handleAddActivity}
          />
        </div>
      </div>
    </div>
  );
};
