import React, { useState } from 'react';
import type { DealActivity } from '../../types/database';
import { Calendar, Phone, FileText, CheckCircle, MessageSquare, Plus } from 'lucide-react';

interface ActivityTimelineProps {
  activities: DealActivity[];
  onAddActivity: (activity: { title: string; description: string; type: 'meeting' | 'call' | 'note' | 'task' }) => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, onAddActivity }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'meeting' | 'call' | 'note'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'meeting' | 'call' | 'note' | 'task'>('note');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddActivity({ title, description, type });
    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  const filtered = activeTab === 'all' 
    ? activities 
    : activities.filter(a => a.type === activeTab);

  const getIcon = (t: string) => {
    switch (t) {
      case 'meeting': return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'call': return <Phone className="w-4 h-4 text-emerald-600" />;
      case 'note': return <FileText className="w-4 h-4 text-sky-600" />;
      default: return <CheckCircle className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
        <div className="flex items-center space-x-2">
          {(['all', 'meeting', 'call', 'note'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Activities' : tab + 's'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Add Activity Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Client Follow-up Call"
                className="w-full text-xs p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full text-xs p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="note">Note</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="task">Task</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter activity notes..."
              className="w-full text-xs p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              rows={2}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Save Activity
            </button>
          </div>
        </form>
      )}

      {/* Timeline Stream */}
      <div className="space-y-4">
        {filtered.map(act => (
          <div key={act.id} className="flex items-start space-x-3 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate">{act.title}</span>
                <span className="text-[11px] text-slate-400">{act.created_at}</span>
              </div>
              {act.description && (
                <p className="text-xs text-slate-600 mt-1">{act.description}</p>
              )}
              <div className="mt-2 flex items-center text-[10px] text-slate-400">
                <MessageSquare className="w-3 h-3 mr-1" />
                <span>Logged by {act.user_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
