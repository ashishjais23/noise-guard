import React, { useState } from 'react';
import {
  Inbox,
  FileText,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Search,
  X,
  FilePlus2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { CitizenReport, ReportStatus } from '../../types';
import { PublicPageId } from '../../components/layout/PublicHeader';

interface MyReportsPageProps {
  reports: CitizenReport[];
  setActivePage: (page: PublicPageId) => void;
}

export const MyReportsPage: React.FC<MyReportsPageProps> = ({
  reports,
  setActivePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);

  // Status badge styling helper
  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
            Submitted
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            Under Review
          </span>
        );
      case 'Verified':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
            Verified
          </span>
        );
      case 'Action Taken':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800">
            Action Taken
          </span>
        );
      case 'Resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            Resolved
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
            Rejected
          </span>
        );
    }
  };

  const filteredReports = reports.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.id.toLowerCase().includes(term) ||
      r.city.toLowerCase().includes(term) ||
      r.location.toLowerCase().includes(term) ||
      r.category.toLowerCase().includes(term) ||
      r.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2">
            <Inbox className="w-3.5 h-3.5" />
            <span>Citizen Surveillance Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Submitted Reports
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Track investigation and resolution progress for all acoustic issues reported by you.
          </p>
        </div>

        <button
          onClick={() => setActivePage('report')}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 rounded-xl shadow-xs transition-all self-start sm:self-center"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>New Report</span>
        </button>
      </div>

      {/* Search Input */}
      {reports.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Report ID, category, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      )}

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Citizen Reports Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm
                ? 'No reports match your search query.'
                : 'You have not submitted any noise violation reports yet.'}
            </p>
          </div>
          <button
            onClick={() => setActivePage('report')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all"
          >
            <span>Report Excessive Noise</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-teal-200 dark:hover:border-teal-800 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                    {report.id}
                  </span>
                  {getStatusBadge(report.status)}
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(report.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    {report.category} Noise Violation
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{report.location}, {report.city}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 italic">
                  "{report.description}"
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                {report.approxNoiseDb && (
                  <span className="font-mono text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    ~{report.approxNoiseDb} dB
                  </span>
                )}
                <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Track Status</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                  {selectedReport.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedReport.category} Noise Report
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Progress Track Pipeline */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Official Status Pipeline
              </span>
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedReport.status)}
                <span className="text-[11px] text-slate-400">
                  Updated: {new Date(selectedReport.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {selectedReport.assignedTo && (
                <div className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <strong>Assigned Authority:</strong> {selectedReport.assignedTo}
                </div>
              )}
            </div>

            {/* Report Information Grid */}
            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-right">{selectedReport.location}, {selectedReport.city}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Approximate Decibels:</span>
                <span className="font-semibold font-mono">{selectedReport.approxNoiseDb ? `${selectedReport.approxNoiseDb} dB` : 'Not specified'}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Date Logged:</span>
                <span className="font-mono">{new Date(selectedReport.timestamp).toLocaleString()}</span>
              </div>

              {selectedReport.evidenceName && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Evidence Attached:</span>
                  <span className="font-semibold font-mono text-teal-600">{selectedReport.evidenceName}</span>
                </div>
              )}

              <div className="pt-2">
                <span className="text-slate-400 block mb-1">Citizen Statement:</span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800 leading-relaxed italic">
                  "{selectedReport.description}"
                </p>
              </div>

              {selectedReport.resolutionNotes && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold block mb-1">Authority Resolution Notes:</span>
                  <p>{selectedReport.resolutionNotes}</p>
                </div>
              )}

              {selectedReport.rejectionReason && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200">
                  <span className="font-bold block mb-1">Rejection Reason:</span>
                  <p>{selectedReport.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="pt-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="w-full py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
