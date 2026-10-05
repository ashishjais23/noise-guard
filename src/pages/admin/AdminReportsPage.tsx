import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  UserCheck,
  Send,
  X,
  MapPin,
  Camera
} from 'lucide-react';
import { CitizenReport, ReportStatus, ReportPriority } from '../../types';

interface AdminReportsPageProps {
  reports: CitizenReport[];
  onUpdateReportStatus: (
    reportId: string,
    status: ReportStatus,
    resolutionNotes?: string,
    rejectionReason?: string,
    assignedTo?: string
  ) => void;
}

export const AdminReportsPage: React.FC<AdminReportsPageProps> = ({
  reports,
  onUpdateReportStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);

  // Modal action states
  const [targetStatus, setTargetStatus] = useState<ReportStatus>('Under Review');
  const [assignedToInput, setAssignedToInput] = useState('');
  const [resolutionNotesInput, setResolutionNotesInput] = useState('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
      if (
        searchTerm &&
        !r.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !r.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !r.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !r.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [reports, statusFilter, categoryFilter, searchTerm]);

  const handleOpenActionModal = (report: CitizenReport) => {
    setSelectedReport(report);
    setTargetStatus(report.status);
    setAssignedToInput(report.assignedTo || '');
    setResolutionNotesInput(report.resolutionNotes || '');
    setRejectionReasonInput(report.rejectionReason || '');
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    onUpdateReportStatus(
      selectedReport.id,
      targetStatus,
      resolutionNotesInput || undefined,
      rejectionReasonInput || undefined,
      assignedToInput || undefined
    );

    setSelectedReport(null);
  };

  const getPriorityBadge = (priority: ReportPriority) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">CRITICAL</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">HIGH</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">MEDIUM</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Citizen Noise Report Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review, investigate, assign nodal squads, and update resolution states for citizen acoustic filings.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Report ID, city, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Verified">Verified</option>
          <option value="Action Taken">Action Taken</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Categories</option>
          <option value="Traffic">Traffic</option>
          <option value="Construction">Construction</option>
          <option value="Loudspeaker">Loudspeaker</option>
          <option value="Horns">Horns</option>
          <option value="Generator">Generator</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
          <option value="Event">Event</option>
        </select>
      </div>

      {/* Reports Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Location &amp; City</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Estimated dB</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
              {filteredReports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                    {r.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white max-w-[160px] truncate">{r.location}</div>
                    <div className="text-[11px] text-slate-400">{r.city}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {r.category}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {r.approxNoiseDb ? `${r.approxNoiseDb} dB` : '—'}
                  </td>
                  <td className="py-3 px-4">{getPriorityBadge(r.priority)}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {new Date(r.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
                    {r.assignedTo || 'Unassigned'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenActionModal(r)}
                      className="px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Review & Action Modal (Requirement #25) */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                  {selectedReport.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Manage Report: {selectedReport.category}
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedReport.location}, {selectedReport.city}
                </span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Statement Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Citizen Statement
              </span>
              <p className="italic text-slate-700 dark:text-slate-300">
                "{selectedReport.description}"
              </p>
              {selectedReport.evidenceName && (
                <div className="mt-2 text-[11px] font-mono text-teal-600">
                  Attached evidence: {selectedReport.evidenceName}
                </div>
              )}
            </div>

            {/* Action Form */}
            <form onSubmit={handleSaveAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Update Investigation Status
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as ReportStatus)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Verified">Verified</option>
                  <option value="Action Taken">Action Taken</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Officer / Squad
                </label>
                <input
                  type="text"
                  placeholder="e.g. CPCB Squad 2 or Traffic Police Inspector"
                  value={assignedToInput}
                  onChange={(e) => setAssignedToInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              {targetStatus !== 'Rejected' ? (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Resolution / Progress Notes (Visible to Citizen)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Patrol dispatched. Notice served to site manager to cease acoustic violation."
                    value={resolutionNotesInput}
                    onChange={(e) => setResolutionNotesInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-rose-700 dark:text-rose-400 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Duplicate report, or sound level verified compliant with daytime commercial norms."
                    value={rejectionReasonInput}
                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-rose-300 dark:border-rose-800 rounded-xl"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 rounded-xl shadow-xs"
                >
                  Save &amp; Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
