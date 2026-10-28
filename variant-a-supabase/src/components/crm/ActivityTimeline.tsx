import React, { useState } from 'react';
import type { DealActivity } from '../../types/database';
import { 
  Clock, 
  FileText, 
  Phone, 
  Paperclip, 
  Mail, 
  ChevronDown, 
  MessageSquare, 
  PhoneCall, 
  StickyNote, 
  Calendar, 
  Plus, 
  Download, 
  Send,
  CheckCircle2
} from 'lucide-react';

interface ActivityTimelineProps {
  dealId: string;
  activities: DealActivity[];
  onAddActivity: (act: Omit<DealActivity, 'id' | 'deal_id' | 'created_at'>) => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, onAddActivity }) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'notes' | 'calls' | 'files' | 'email'>('activities');
  
  // Modal states
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<DealActivity['type']>('meeting');
  const [newDateGroup, setNewDateGroup] = useState('Today');
  
  // Note Tab State
  const [noteContent, setNoteContent] = useState('');
  const [notesList, setNotesList] = useState<string[]>([
    'Customer confirmed they will finalize budget allocation by Q4 board meeting.',
    'Technical review with lead software engineer approved integration architecture.'
  ]);

  // Call Tab State
  const [callRecipient, setCallRecipient] = useState('Robert Cosper');
  const [callDuration, setCallDuration] = useState('15 mins');
  const [callNotes, setCallNotes] = useState('');
  const [callLog, setCallLog] = useState<{ recipient: string; duration: string; notes: string; date: string }[]>([
    { recipient: 'Robert Cosper', duration: '12 mins', notes: 'Walked through pricing tiers and SLA guarantee.', date: '28 Sep 2025, 09:30 PM' },
    { recipient: 'Denwar', duration: '8 mins', notes: 'Scheduled follow-up meeting with product team.', date: '27 Sep 2025, 03:15 PM' }
  ]);

  // Files Tab State
  const [filesList, setFilesList] = useState<{ name: string; size: string; date: string }[]>([
    { name: 'Nexora_CRM_Subscription_Proposal_v2.pdf', size: '2.4 MB', date: '25 Sep 2025' },
    { name: 'Master_Services_Agreement_Signed.docx', size: '1.8 MB', date: '22 Sep 2025' },
    { name: 'Security_Compliance_Verification_Report.pdf', size: '4.1 MB', date: '18 Sep 2025' }
  ]);
  const [uploadFileName, setUploadFileName] = useState('');

  // Email Tab State
  const [emailTo, setEmailTo] = useState('robert.cosper@nexora.com');
  const [emailSubject, setEmailSubject] = useState('CRM Subscription Contract & Onboarding Schedule');
  const [emailBody, setEmailBody] = useState('Hi Robert,\n\nFollowing up on our call today, please find attached the revised contract with confirmed licensing tiers.\n\nBest regards,\nJamie Anderson');
  const [sentEmails, setSentEmails] = useState<{ to: string; subject: string; date: string }[]>([
    { to: 'robert.cosper@nexora.com', subject: 'Architecture Walkthrough Follow-up', date: '28 Sep 2025, 10:25 PM' },
    { to: 'support@nexora.com', subject: 'API Provisioning Credentials for Staging', date: '24 Sep 2025, 11:00 AM' }
  ]);

  // Expandable sections for Activities tab
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Today': true,
    '28 Sep 2025': true,
    '27 Sep 2025': true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddActivity({
      title: newTitle,
      description: newDesc,
      type: newType,
      date_group: newDateGroup,
      user_name: 'Jamie Anderson',
      priority: 'High',
      reminder: '15 Mins Before',
      assigned_to: 'Jamie Anderson'
    });
    setNewTitle('');
    setNewDesc('');
    setShowAddActivityModal(false);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setNotesList(prev => [noteContent, ...prev]);
    onAddActivity({
      title: 'Note added by Jamie Anderson',
      description: noteContent,
      type: 'note',
      date_group: 'Today',
      user_name: 'Jamie Anderson'
    });
    setNoteContent('');
  };

  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callNotes.trim()) return;
    const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCallLog(prev => [{ recipient: callRecipient, duration: callDuration, notes: callNotes, date: 'Today, ' + dateStr }, ...prev]);
    onAddActivity({
      title: `Call with ${callRecipient} (${callDuration})`,
      description: callNotes,
      type: 'call',
      date_group: 'Today',
      user_name: 'Jamie Anderson',
      call_outcome: 'Completed'
    });
    setCallNotes('');
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    setFilesList(prev => [{ name: uploadFileName, size: '1.2 MB', date: 'Today' }, ...prev]);
    onAddActivity({
      title: `Uploaded document: ${uploadFileName}`,
      description: 'Attached file to deal repository.',
      type: 'file',
      date_group: 'Today',
      user_name: 'Jamie Anderson',
      file_name: uploadFileName
    });
    setUploadFileName('');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;
    const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSentEmails(prev => [{ to: emailTo, subject: emailSubject, date: 'Today, ' + dateStr }, ...prev]);
    onAddActivity({
      title: `Email sent to ${emailTo}: "${emailSubject}"`,
      description: emailBody,
      type: 'email',
      date_group: 'Today',
      user_name: 'Jamie Anderson'
    });
    alert(`Email successfully sent to ${emailTo}`);
  };

  // Group activities by date_group
  const todayActs = activities.filter(a => a.date_group === 'Today' || !a.date_group);
  const sep28Acts = activities.filter(a => a.date_group === '28 Sep 2025');
  const sep27Acts = activities.filter(a => a.date_group === '27 Sep 2025');

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* 5-Tab Navigation Bar matching deal-details.html */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50/50 px-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center space-x-2 py-3 px-4 font-semibold text-xs border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'activities'
              ? 'border-emerald-600 text-slate-900 bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Activities</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center space-x-2 py-3 px-4 font-semibold text-xs border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'notes'
              ? 'border-emerald-600 text-slate-900 bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('calls')}
          className={`flex items-center space-x-2 py-3 px-4 font-semibold text-xs border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'calls'
              ? 'border-emerald-600 text-slate-900 bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Calls</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center space-x-2 py-3 px-4 font-semibold text-xs border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'files'
              ? 'border-emerald-600 text-slate-900 bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>Files</span>
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center space-x-2 py-3 px-4 font-semibold text-xs border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'email'
              ? 'border-emerald-600 text-slate-900 bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email</span>
        </button>
      </div>

      <div className="p-6">
        {/* TAB 1: ACTIVITIES (Date-Grouped Chronological Timeline) */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Activities</h4>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAddActivityModal(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
                <div className="flex items-center text-xs text-slate-500 border border-slate-200 rounded px-2.5 py-1 bg-white cursor-pointer hover:bg-slate-50">
                  <span>Sort By: Newest</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </div>
            </div>

            {/* GROUP: Today */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('Today')}
                className="flex items-center justify-between w-full py-1 text-left cursor-pointer"
              >
                <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Today
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections['Today'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['Today'] && (
                <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-3">
                  {todayActs.map(act => (
                    <div key={act.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs transition">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-slate-900">{act.title}</h5>
                            <span className="text-[10px] text-slate-400">{act.created_at}</span>
                          </div>
                          {act.description && (
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.description}</p>
                          )}

                          {/* Inline Controls from 08_Deals_Activities.jpg */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">Reminder *</label>
                              <select className="w-full text-xs p-1.5 rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                <option>15 Mins Before</option>
                                <option>30 Mins Before</option>
                                <option>1 Hour Before</option>
                                <option>1 Day Before</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">Task Priority *</label>
                              <select className="w-full text-xs p-1.5 rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">Assigned to *</label>
                              <select className="w-full text-xs p-1.5 rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                <option>Jamie Anderson</option>
                                <option>Robert Cosper</option>
                                <option>Ethan Walker</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GROUP: 28 Sep 2025 */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('28 Sep 2025')}
                className="flex items-center justify-between w-full py-1 text-left cursor-pointer"
              >
                <span className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-0.5 rounded">
                  28 Sep 2025
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections['28 Sep 2025'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['28 Sep 2025'] && (
                <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-3">
                  {sep28Acts.map(act => (
                    <div key={act.id} className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start space-x-3 shadow-xs">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                        act.type === 'call'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : act.type === 'note'
                          ? 'bg-rose-50 text-rose-600 border-rose-100'
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {act.type === 'call' ? <PhoneCall className="w-3.5 h-3.5" /> : act.type === 'note' ? <StickyNote className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-900">{act.title}</span>
                          <span className="text-[10px] text-slate-400">{act.created_at}</span>
                        </div>
                        {act.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GROUP: 27 Sep 2025 */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('27 Sep 2025')}
                className="flex items-center justify-between w-full py-1 text-left cursor-pointer"
              >
                <span className="bg-slate-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded">
                  27 Sep 2025
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections['27 Sep 2025'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['27 Sep 2025'] && (
                <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-3">
                  {sep27Acts.map(act => (
                    <div key={act.id} className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start space-x-3 shadow-xs">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                        act.type === 'meeting'
                          ? 'bg-amber-50 text-amber-600 border-amber-100'
                          : 'bg-purple-50 text-purple-600 border-purple-100'
                      }`}>
                        {act.type === 'meeting' ? <Calendar className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-900">{act.title}</span>
                          <span className="text-[10px] text-slate-400">{act.created_at}</span>
                        </div>
                        {act.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900">Deal Notes & Internal Memoranda</h4>
            <form onSubmit={handleSaveNote} className="space-y-3">
              <textarea
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                placeholder="Write a private note regarding client conversations, contractual caveats, or pricing..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={3}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700 transition"
                >
                  Save Note
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {notesList.map((note, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">Antony / Account Manager</span>
                    <span className="text-[10px] text-slate-400">Verified Note</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CALLS */}
        {activeTab === 'calls' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900">Log Call Communication</h4>
            <form onSubmit={handleLogCall} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Call Recipient</label>
                  <input
                    type="text"
                    value={callRecipient}
                    onChange={e => setCallRecipient(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-200 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration</label>
                  <input
                    type="text"
                    value={callDuration}
                    onChange={e => setCallDuration(e.target.value)}
                    placeholder="e.g. 15 mins"
                    className="w-full text-xs p-2 rounded border border-slate-200 bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Call Notes & Outcome</label>
                <textarea
                  value={callNotes}
                  onChange={e => setCallNotes(e.target.value)}
                  placeholder="Summary of phone discussion..."
                  className="w-full text-xs p-2 rounded border border-slate-200 bg-white"
                  rows={2}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-semibold text-xs rounded hover:bg-emerald-700"
                >
                  Log Call
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {callLog.map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{c.recipient} ({c.duration})</span>
                      <span className="text-[10px] text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{c.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FILES */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900">Attached Documents & Collateral</h4>
            <form onSubmit={handleUploadFile} className="flex gap-2">
              <input
                type="text"
                value={uploadFileName}
                onChange={e => setUploadFileName(e.target.value)}
                placeholder="Document file name (e.g. Technical_Specs.pdf)..."
                className="flex-1 text-xs p-2 rounded border border-slate-200 bg-white"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700"
              >
                Upload File
              </button>
            </form>

            <div className="space-y-2">
              {filesList.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
                  <div className="flex items-center space-x-3">
                    <Paperclip className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{f.name}</div>
                      <div className="text-[10px] text-slate-400">{f.size} • Uploaded {f.date}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Downloading ${f.name}...`)}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: EMAIL */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900">Compose & Sent Email Thread</h4>
            <form onSubmit={handleSendEmail} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">To</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={e => setEmailTo(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-200 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-200 bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Body</label>
                <textarea
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-slate-200 bg-white font-sans"
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Communication History</div>
              {sentEmails.map((em, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{em.subject}</div>
                      <div className="text-[10px] text-slate-400">Recipient: {em.to} • {em.date}</div>
                    </div>
                  </div>
                  <span className="flex items-center text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Deal Activity</h3>
            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., Solution Demonstration Meeting"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="call">Call</option>
                    <option value="note">Note</option>
                    <option value="activity">Message</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date Group</label>
                  <select
                    value={newDateGroup}
                    onChange={e => setNewDateGroup(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Today">Today</option>
                    <option value="28 Sep 2025">28 Sep 2025</option>
                    <option value="27 Sep 2025">27 Sep 2025</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Details of the activity..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
