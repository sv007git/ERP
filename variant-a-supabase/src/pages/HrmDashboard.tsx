import React, { useState } from 'react';
import { LocalErpStore } from '../lib/supabase';
import type { Employee } from '../types/database';
import { Users, Calendar, Clock, DollarSign, CheckCircle2, UserPlus, Briefcase, X } from 'lucide-react';

export const HrmDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(() => LocalErpStore.getEmployees());
  const [clockedIn, setClockedIn] = useState(false);
  const [leavePending, setLeavePending] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Add Employee modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('7500');

  const handleApproveLeave = () => {
    try {
      const updated = LocalErpStore.deductLeave('emp-001', 3);
      setEmployees([...LocalErpStore.getEmployees()]);
      setLeavePending(false);
      setMessage(`Leave approved for Alex Thompson! 3 days deducted. Remaining balance: ${updated.leave_balance} days.`);
      setTimeout(() => setMessage(null), 4000);
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    LocalErpStore.addEmployee({
      full_name: fullName.trim(),
      email: email.trim(),
      department_name: department,
      position: position.trim() || 'Software Specialist',
      salary: parseFloat(salary) || 5000,
      leave_balance: 20,
      status: 'Active'
    });

    setEmployees([...LocalErpStore.getEmployees()]);
    setFullName('');
    setEmail('');
    setPosition('');
    setShowAddModal(false);
    setMessage(`Employee ${fullName.trim()} registered successfully!`);
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Greeting Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Good morning, Andrew</h1>
          <p className="text-xs text-slate-500 mt-1">
            You have {leavePending ? '1 pending leave request' : '0 pending requests'} and {employees.length} active team members.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => {
              setClockedIn(true);
              setMessage('Clocked in successfully at ' + new Date().toLocaleTimeString());
              setTimeout(() => setMessage(null), 3000);
            }}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center transition ${
              clockedIn
                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {clockedIn ? 'Clocked In (Active)' : 'Clock In Now'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center transition"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            + Add Employee
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold shadow-xs">
          {message}
        </div>
      )}

      {/* HRM KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Workforce</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{employees.length} Employees</div>
            <span className="text-emerald-600 text-xs font-semibold">Active team profiles</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">On Leave Today</span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{leavePending ? '1' : '0'} Pending</div>
            <span className="text-slate-400 text-xs">Annual & sick leaves</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Attendance Rate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">96.8%</div>
            <span className="text-emerald-600 text-xs font-semibold">↗ High punctuality</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Payroll</span>
            <DollarSign className="w-5 h-5 text-purple-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              ${employees.reduce((sum, e) => sum + e.salary, 0).toLocaleString()}
            </div>
            <span className="text-slate-400 text-xs">Monthly base calculation</span>
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
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            + Add Employee
          </button>
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

      {/* Modal: Add Employee */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Register Employee</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. sarah@falcon.com"
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Salary ($)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
