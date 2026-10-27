import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Employee } from '../types/database';
import { Users, Calendar, Clock, DollarSign, CheckCircle2, UserPlus, Briefcase } from 'lucide-react';

export const HrmDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(LocalErpStore.getEmployees());
  const [clockedIn, setClockedIn] = useState(false);
  const [leavePending, setLeavePending] = useState(true);

  const handleApproveLeave = () => {
    // Deduct 3 days from Alex Thompson (emp-001)
    const updated = LocalErpStore.deductLeave('emp-001', 3);
    setEmployees(prev => prev.map(e => e.id === 'emp-001' ? updated : e));
    setLeavePending(false);
  };

  return (
    <div className="space-y-8">
      {/* Greeting Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Good morning, Andrew</h1>
          <p className="text-xs text-slate-500 mt-1">
            You have {leavePending ? '1 pending leave request' : '0 pending requests'} and 2 urgent talent review alerts.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setClockedIn(true)}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center transition ${
              clockedIn
                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {clockedIn ? 'Clocked In: 09:00 AM' : 'Clock In Now'}
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center transition">
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            + Add Employee
          </button>
        </div>
      </div>

      {/* HRM KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Workforce</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">1,284</div>
            <span className="text-emerald-600 text-xs font-semibold">↗ 12 new this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">On Leave Today</span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">23</div>
            <span className="text-slate-400 text-xs">9 planned, 14 unplanned</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Attendance Rate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">94.2%</div>
            <span className="text-emerald-600 text-xs font-semibold">↗ +3.6% vs target</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Payroll</span>
            <DollarSign className="w-5 h-5 text-purple-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">$1,248K</div>
            <span className="text-slate-400 text-xs">March 2026 processing</span>
          </div>
        </div>
      </div>

      {/* Pending Leave Requests Notification / Approval Action */}
      {leavePending && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
              LR
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">Pending Leave Application: Alex Thompson</div>
              <div className="text-[11px] text-amber-700">Annual Leave • 3 Days (2026-11-10 to 2026-11-12) • "Vacation trip"</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleApproveLeave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm transition"
            >
              Approve Leave (Deduct 3 Days)
            </button>
          </div>
        </div>
      )}

      {/* Employee Directory */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-slate-800 flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-slate-500" />
            Active Employee Directory
          </h4>
          <span className="text-xs text-slate-400">Showing {employees.length} employees</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3">Salary</th>
                <th className="py-2.5 px-3">Leave Balance</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {employees.map(e => (
                <tr key={e.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-semibold text-slate-900">{e.employee_code}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{e.full_name}</div>
                    <div className="text-[10px] text-slate-400">{e.email}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {e.department_name}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{e.position}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">${e.salary.toLocaleString()}/mo</td>
                  <td className="py-3 px-3 font-semibold text-indigo-600">{e.leave_balance} days</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
