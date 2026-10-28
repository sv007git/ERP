import React from 'react';
import type { DealStage } from '../../types/database';
import { ChevronRight } from 'lucide-react';

interface DealPipelineProps {
  currentStage: DealStage;
  onAdvanceStage: (stage: DealStage) => void;
}

interface StageConfig {
  id: DealStage;
  label: string;
  activeColor: string;
  textColor: string;
  bgHex: string;
}

const STAGES: StageConfig[] = [
  { id: 'Qualify To Buy', label: 'Qualify To Buy', activeColor: 'bg-amber-600', textColor: 'text-white', bgHex: '#d97706' },
  { id: 'Contact Made', label: 'Contact Made', activeColor: 'bg-fuchsia-600', textColor: 'text-white', bgHex: '#c026d3' },
  { id: 'Presentation', label: 'Presentation', activeColor: 'bg-rose-600', textColor: 'text-white', bgHex: '#e11d48' },
  { id: 'Proposal Made', label: 'Proposal Made', activeColor: 'bg-sky-500', textColor: 'text-white', bgHex: '#0ea5e9' },
  { id: 'Appointment', label: 'Appointment', activeColor: 'bg-slate-400', textColor: 'text-slate-800', bgHex: '#cbd5e1' },
];

export const DealPipeline: React.FC<DealPipelineProps> = ({ currentStage, onAdvanceStage }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800">Deal Pipeline Status</h3>
        <span className="text-xs text-slate-400">Click a chevron to update stage in database</span>
      </div>

      {/* Responsive Chevron Bar */}
      <div className="flex flex-wrap lg:flex-nowrap items-center w-full gap-1 overflow-x-auto py-1">
        {STAGES.map((stage, idx) => {
          const isActive = currentStage === stage.id;
          const isPassed = STAGES.findIndex(s => s.id === currentStage) >= idx;

          return (
            <button
              key={stage.id}
              onClick={() => onAdvanceStage(stage.id)}
              type="button"
              className={`relative flex-1 min-w-[150px] h-11 px-4 flex items-center justify-center font-bold text-xs transition duration-150 cursor-pointer select-none group ${
                isActive
                  ? `${stage.activeColor} ${stage.textColor} shadow-md scale-[1.01] z-10 rounded-sm`
                  : isPassed
                  ? `${stage.activeColor} ${stage.textColor} opacity-90 rounded-sm`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-sm'
              }`}
            >
              <span className="truncate">{stage.label}</span>
              {idx < STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20">
                  <ChevronRight className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
