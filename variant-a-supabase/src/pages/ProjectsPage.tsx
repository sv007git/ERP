import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Project } from '../types/database';
import { 
  FolderKanban, 
  Plus, 
  Calendar, 
  ChevronRight, 
  MoreVertical, 
  Printer
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => LocalErpStore.getProjects());
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // Form states
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [teamLeader, setTeamLeader] = useState('Ethan Walker');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [progress, setProgress] = useState('25');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    LocalErpStore.addProject({
      name: projectName,
      description: projectDesc,
      team_leader: teamLeader,
      team_members: ['Alex T.', 'Maria G.'],
      deadline: deadline,
      progress: parseInt(progress) || 0,
      status: parseInt(progress) >= 100 ? 'Completed' : 'In Progress'
    });

    setProjects(LocalErpStore.getProjects());
    setProjectName('');
    setProjectDesc('');
    setShowAddProjectModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching 09_Projects.jpg */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise project portfolio, resource allocation, and milestone tracking
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.print()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-xs flex items-center shadow-xs"
            title="Print Projects"
          >
            <Printer className="w-4 h-4 mr-1.5" /> Print
          </button>

          <button
            onClick={() => setShowAddProjectModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Projects Grid matching 09_Projects.jpg */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div 
            key={proj.id} 
            className="bg-white rounded-xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-xs flex flex-col justify-between transition group"
          >
            <div>
              {/* Card Header: Icon, Code & Title */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-50 to-teal-100 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-200/60 shadow-2xs">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition leading-snug">
                      {proj.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{proj.code}</span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Progress</span>
                  <span className="font-bold text-slate-900">{proj.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    style={{ width: `${proj.progress}%` }} 
                    className={`h-full rounded-full transition-all duration-300 ${
                      proj.progress === 100 
                        ? 'bg-emerald-500' 
                        : proj.progress >= 70 
                        ? 'bg-sky-500' 
                        : proj.progress >= 40 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500'
                    }`} 
                  />
                </div>
              </div>
            </div>

            {/* Card Footer: Team Leader, Avatars, Deadline */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-[9px] flex items-center justify-center">
                    {proj.team_leader.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{proj.team_leader}</span>
                </div>
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-[8px] flex items-center justify-center border-2 border-white">
                    AT
                  </div>
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-[8px] flex items-center justify-center border-2 border-white">
                    MG
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-[8px] flex items-center justify-center border-2 border-white">
                    +3
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> Deadline: {proj.deadline}
                </span>

                <button 
                  onClick={() => alert(`Opening details for ${proj.name}...`)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Project */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create New Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="e.g. Logistics Portal 2.0"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={projectDesc}
                  onChange={e => setProjectDesc(e.target.value)}
                  placeholder="Scope of work and key milestones..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Team Leader</label>
                  <input
                    type="text"
                    value={teamLeader}
                    onChange={e => setTeamLeader(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={e => setProgress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
