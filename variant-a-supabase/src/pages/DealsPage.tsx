import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Deal, DealActivity, DealStage } from '../types/database';
import { DealPipeline } from '../components/crm/DealPipeline';
import { ActivityTimeline } from '../components/crm/ActivityTimeline';
import { ArrowLeft, Building2, MapPin, Tag, UserCheck, Shield } from 'lucide-react';

interface DealsPageProps {
  dealId?: string;
  onBack: () => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ dealId = 'del-020', onBack }) => {
  const [deal, setDeal] = useState<Deal>(() => LocalErpStore.getDeal(dealId) || LocalErpStore.getDeals()[0]);
  const [activities, setActivities] = useState<DealActivity[]>(() => LocalErpStore.getActivities(deal.id));

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

    // Automatically record activity for stage change
    const newAct = LocalErpStore.addActivity(deal.id, {
      title: `Stage changed to ${newStage}`,
      description: `Deal probability automatically adjusted to ${stageProbabilities[newStage]}%.`,
      type: 'note',
      user_name: 'Jamie Anderson'
    });
    setActivities(prev => [newAct, ...prev]);
  };

  const handleAddActivity = (data: { title: string; description: string; type: 'meeting' | 'call' | 'note' | 'task' }) => {
    const newAct = LocalErpStore.addActivity(deal.id, {
      ...data,
      user_name: 'Jamie Anderson'
    });
    setActivities(prev => [newAct, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center border border-orange-200 shadow-xs">
              CR
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">{deal.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  deal.status === 'Won' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-sky-50 text-sky-700 border-sky-200'
                }`}>
                  {deal.status}
                </span>
                <span className="flex items-center text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  <Shield className="w-3 h-3 mr-1" /> Private
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center"><Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" /> {deal.company_name}</span>
                <span>•</span>
                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> 22, Ave Street, New York, USA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium">Deal Value</div>
          <div className="text-2xl font-extrabold text-slate-900">
            ${deal.deal_value.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Interactive Chevron Pipeline Stages */}
      <DealPipeline
        currentStage={deal.stage}
        onAdvanceStage={handleAdvanceStage}
      />

      {/* Grid: Deal Info Sidebar + Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Metadata Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              Deal Information
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Date Created</span>
                <span className="font-semibold text-slate-800">{deal.created_at}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Probability</span>
                <span className="font-semibold text-emerald-600">{deal.probability}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Priority</span>
                <span className="font-semibold text-slate-800">{deal.priority}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Due Date</span>
                <span className="font-semibold text-slate-800">{deal.due_date || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Source</span>
                <span className="font-semibold text-slate-800">Paid Campaign</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Deal Owner</span>
              <button className="text-[11px] text-emerald-600 font-semibold hover:underline">+ Change</button>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                RC
              </div>
              <div>
                <div className="font-semibold text-slate-900">Robert Cosper</div>
                <div className="text-[11px] text-slate-400">Sales Manager</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block pb-2 border-b border-slate-100">
              Tags & Projects
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium flex items-center">
                <Tag className="w-3 h-3 mr-1 text-slate-400" /> Collab
              </span>
              <span className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 font-medium">VIP</span>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-medium flex items-center">
                <UserCheck className="w-3 h-3 mr-1" /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* Right Tabbed Timeline */}
        <div className="lg:col-span-2">
          <ActivityTimeline
            activities={activities}
            onAddActivity={handleAddActivity}
          />
        </div>
      </div>
    </div>
  );
};
