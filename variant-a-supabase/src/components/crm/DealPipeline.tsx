import React from 'react';
import type { DealStage } from '../../types/database';

interface DealPipelineProps {
  currentStage: DealStage;
  onAdvanceStage: (stage: DealStage) => void;
}

const STAGES: { name: DealStage; label: string; color: string; prob: number }[] = [
  { name: 'Qualify To Buy', label: 'Qualify To Buy', color: 'bg-orange-500 text-white', prob: 20 },
  { name: 'Contact Made', label: 'Contact Made', color: 'bg-pink-500 text-white', prob: 40 },
  { name: 'Presentation', label: 'Presentation', color: 'bg-rose-600 text-white', prob: 60 },
  { name: 'Proposal Made', label: 'Proposal Made', color: 'bg-sky-500 text-white', prob: 80 },
  { name: 'Appointment', label: 'Appointment', color: 'bg-purple-600 text-white', prob: 90 },
  { name: 'Won', label: 'Won', color: 'bg-emerald-600 text-white', prob: 100 },
];

export const DealPipeline: React.FC<DealPipelineProps> = ({ currentStage, onAdvanceStage }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Deal Pipeline Chevron Status
        </span>
        <span className="text-xs text-slate-400">Click a stage to advance deal state</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {STAGES.map((s) => {
          const isActive = currentStage === s.name;
          return (
            <button
              key={s.name}
              onClick={() => onAdvanceStage(s.name)}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition text-center ${
                isActive
                  ? `${s.color} ring-2 ring-emerald-500 ring-offset-2 shadow-sm font-bold scale-[1.02]`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <div>{s.label}</div>
              <div className="text-[10px] opacity-80 mt-0.5">{s.prob}% Prob</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
