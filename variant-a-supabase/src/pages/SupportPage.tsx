import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Ticket } from '../types/database';
import { 
  Headphones, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  Plus, 
  ChevronDown
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(() => LocalErpStore.getTickets());
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<Ticket['priority']>('Medium');
  const [assignedTo, setAssignedTo] = useState('Steven Schroer');

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !subject) return;

    LocalErpStore.addTicket({
      customer_name: customerName,
      subject: subject,
      priority: priority,
      assigned_to: assignedTo,
      status: 'Open'
    });

    setTickets(LocalErpStore.getTickets());
    setCustomerName('');
    setSubject('');
    setShowAddTicketModal(false);
  };

  const handleStatusChange = (tktId: string, status: Ticket['status']) => {
    LocalErpStore.updateTicketStatus(tktId, status);
    setTickets(LocalErpStore.getTickets());
  };

  const openCount = tickets.filter(t => t.status === 'Open' || t.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Top Header matching 06_Support_Dashboard.jpg */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Support Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Customer helpdesk ticketing, SLA compliance tracking, and service resolution metrics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs">
            <span>Last 30 Days</span>
            <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
          </div>

          <button
            onClick={() => setShowAddTicketModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tickets</span>
          </button>
        </div>
      </div>

      {/* KPI Row matching 06_Support_Dashboard.jpg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Open Tickets</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{openCount}</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              Active Inquiries
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Headphones className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Avg Response</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">2.4 hrs</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              First Response Time
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">SLA Compliance</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">94%</div>
            <div className="text-[11px] text-teal-600 font-semibold mt-1">
              On-Target Resolutions
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">KB Articles</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">378</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">
              Self-service Guides
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Ticket Volume & SLA Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Ticket Volume</h3>
            <span className="text-xs text-slate-400">2026 Volume</span>
          </div>

          <div className="h-60 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {[
              { m: 'Jan', cr: 32, res: 20 },
              { m: 'Feb', cr: 45, res: 28 },
              { m: 'Mar', cr: 38, res: 24 },
              { m: 'Apr', cr: 40, res: 22 },
              { m: 'May', cr: 78, res: 35, highlight: true },
              { m: 'Jun', cr: 30, res: 18 },
              { m: 'Jul', cr: 42, res: 28 },
              { m: 'Aug', cr: 55, res: 36 },
              { m: 'Sep', cr: 65, res: 48 },
              { m: 'Oct', cr: 58, res: 42 },
              { m: 'Nov', cr: 48, res: 34 },
              { m: 'Dec', cr: 36, res: 26 }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                {bar.highlight && (
                  <span className="text-[9px] font-bold text-white bg-slate-900 px-1 py-0.5 rounded mb-1">
                    78
                  </span>
                )}
                <div className="w-full max-w-[20px] flex flex-col items-center gap-0.5 h-full justify-end">
                  <div style={{ height: `${bar.cr}%` }} className="w-full bg-slate-200 rounded-t-xs" />
                  <div style={{ height: `${bar.res}%` }} className="w-full bg-emerald-600 rounded-t-xs" />
                </div>
                <span className="text-[10px] text-slate-400 mt-2">{bar.m}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-6 mt-4 text-xs font-semibold">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="text-slate-600">Tickets Created</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-slate-600">Tickets Resolved</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">SLA Breaches</h3>
              <span className="text-xs text-slate-400">Today</span>
            </div>

            <div className="flex items-center justify-center p-4">
              <div className="w-36 h-36 rounded-full border-8 border-emerald-500 border-t-amber-500 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-extrabold text-slate-900">70%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Compliant</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" /> SLA Compliant
              </span>
              <span className="font-bold text-slate-900">70</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-slate-600">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> SLA Breached
              </span>
              <span className="font-bold text-amber-600">30</span>
            </div>
          </div>
        </div>
      </div>

      {/* All Tickets Table matching 06_Support_Dashboard.jpg */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">All Tickets</h3>
          <span className="text-xs text-slate-400">Live support queue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((tkt) => (
                <tr key={tkt.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{tkt.code}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{tkt.customer_name}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{tkt.subject}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      tkt.priority === 'High'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : tkt.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {tkt.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{tkt.assigned_to}</td>
                  <td className="py-3.5 px-4 text-slate-400">{tkt.last_updated}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tkt.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : tkt.status === 'Open'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : tkt.status === 'Closed'
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {tkt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {tkt.status !== 'Resolved' && (
                      <button
                        onClick={() => handleStatusChange(tkt.id, 'Resolved')}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 cursor-pointer"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Ticket */}
      {showAddTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create Support Ticket</h3>
            <form onSubmit={handleAddTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Issue title..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Technician</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTicketModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
