import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { NoiseReading, DataSource } from '../../types';
import { Upload, Download, CheckCircle, AlertCircle, Check } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

interface ParsedRow {
  rowNumber: number;
  location: string;
  date: string;
  time: string;
  noiseLevelDb: number;
  dataSource: DataSource;
  isValid: boolean;
  error?: string;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Sample CSV generator
  const downloadSampleCsv = () => {
    const csvContent =
      'location,date,time,noise_level_db,data_source\n' +
      'Main Arterial Road (MG Highway Junction),2026-09-29,10:30:00,78.4,OBSERVED\n' +
      'University Campus Gate & Transit Plaza,2026-09-29,11:15:00,63.1,OBSERVED\n' +
      'City Central Market & Commercial Bazaar,2026-09-29,12:00:00,74.5,OBSERVED\n' +
      'Greenfield Residential Colony (Block B),2026-09-29,14:20:00,48.2,OBSERVED\n' +
      'District Multi-Specialty Hospital & Silence Zone,2026-09-29,15:45:00,46.8,OBSERVED\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'noisewatch_sample_measurements.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  const parseCsv = (text: string) => {
    setGeneralError(null);
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) {
      setGeneralError('CSV must include a header row and at least one data record.');
      setParsedRows([]);
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const reqCols = ['location', 'date', 'time', 'noise_level_db', 'data_source'];
    const missing = reqCols.filter((col) => !headers.includes(col));

    if (missing.length > 0) {
      setGeneralError(`Missing mandatory columns: ${missing.join(', ')}`);
      setParsedRows([]);
      return;
    }

    const locIdx = headers.indexOf('location');
    const dateIdx = headers.indexOf('date');
    const timeIdx = headers.indexOf('time');
    const dbIdx = headers.indexOf('noise_level_db');
    const srcIdx = headers.indexOf('data_source');

    const rows: ParsedRow[] = [];
    const seenSignatures = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map((p) => p.trim());
      const location = parts[locIdx] || '';
      const date = parts[dateIdx] || '';
      const time = parts[timeIdx] || '';
      const dbStr = parts[dbIdx] || '';
      const srcStr = (parts[srcIdx] || 'OBSERVED').toUpperCase();

      let isValid = true;
      let error = '';

      if (!location) {
        isValid = false;
        error = 'Location name is required.';
      }

      const db = parseFloat(dbStr);
      if (isNaN(db) || db < 20 || db > 140) {
        isValid = false;
        error = 'Invalid noise level. Must be between 20.0 and 140.0 dB.';
      }

      const isoCandidate = `${date}T${time}`;
      const d = new Date(isoCandidate);
      if (isNaN(d.getTime())) {
        isValid = false;
        error = 'Invalid date/time format. Use YYYY-MM-DD and HH:MM:SS.';
      }

      const signature = `${location}-${date}-${time}`;
      if (seenSignatures.has(signature)) {
        isValid = false;
        error = 'Duplicate measurement timestamp for this location.';
      } else {
        seenSignatures.add(signature);
      }

      const validSrc: DataSource =
        srcStr === 'OBSERVED' ? 'OBSERVED' : srcStr === 'RESEARCH DATA' ? 'RESEARCH DATA' : 'SIMULATED';

      rows.push({
        rowNumber: i + 1,
        location,
        date,
        time,
        noiseLevelDb: isNaN(db) ? 0 : db,
        dataSource: validSrc,
        isValid,
        error: error || undefined
      });
    }

    setParsedRows(rows);
  };

  const handleCommitImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) return;

    // Map rows to NoiseReading objects
    const newReadings: NoiseReading[] = validRows.map((r, idx) => {
      // Find matching location id or use a fallback
      const locMatch = dataService
        .getLocations()
        .find((l) => l.name.toLowerCase().includes(r.location.toLowerCase()));

      return {
        id: `imp-${Date.now()}-${idx}`,
        locationId: locMatch ? locMatch.id : 'loc-1',
        locationName: r.location,
        noiseLevelDb: r.noiseLevelDb,
        timestamp: new Date(`${r.date}T${r.time}`).toISOString(),
        dataSource: r.dataSource,
        measurementMethod: 'Imported Field Measurement'
      };
    });

    dataService.importObservedReadings(newReadings);
    onImportComplete();
    onClose();
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Noise Measurements (CSV)"
      subtitle="Upload manually collected field observations or research datasets"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Top Actions: Sample Download & File Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div>
            <h4 className="text-xs font-bold text-slate-800">CSV Structure Guide</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Requires columns: <code className="bg-white px-1 py-0.5 rounded border">location</code>,{' '}
              <code className="bg-white px-1 py-0.5 rounded border">date</code>,{' '}
              <code className="bg-white px-1 py-0.5 rounded border">time</code>,{' '}
              <code className="bg-white px-1 py-0.5 rounded border">noise_level_db</code>,{' '}
              <code className="bg-white px-1 py-0.5 rounded border">data_source</code>
            </p>
          </div>

          <button
            onClick={downloadSampleCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Download Sample CSV</span>
          </button>
        </div>

        {/* File Dropzone */}
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
          <Upload className="w-8 h-8 text-teal-600 mb-2" />
          <span className="text-xs font-semibold text-slate-800">
            {fileName ? fileName : 'Choose CSV file to upload or drag & drop here'}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            UTF-8 encoded .csv files up to 5 MB
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {generalError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Preview Table */}
        {parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Dataset Preview ({parsedRows.length} rows parsed)
              </span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {validCount} Valid
                </span>
                {invalidCount > 0 && (
                  <span className="text-rose-700 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {invalidCount} Invalid (Will be skipped)
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto max-h-56 border border-slate-200 rounded-xl">
              <table className="min-w-full text-xs text-left divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Timestamp</th>
                    <th className="px-3 py-2">Decibels</th>
                    <th className="px-3 py-2">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {parsedRows.map((r) => (
                    <tr
                      key={r.rowNumber}
                      className={r.isValid ? 'hover:bg-slate-50/50' : 'bg-rose-50/40 text-rose-800'}
                    >
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-400">
                        #{r.rowNumber}
                      </td>
                      <td className="px-3 py-2">
                        {r.isValid ? (
                          <span className="inline-flex items-center text-emerald-600 font-semibold gap-1">
                            <Check className="w-3 h-3" /> Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-rose-600 font-semibold gap-1" title={r.error}>
                            <AlertCircle className="w-3 h-3" /> Error
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium">{r.location}</td>
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-500">
                        {r.date} {r.time}
                      </td>
                      <td className="px-3 py-2 font-mono font-bold">
                        {r.noiseLevelDb} dB
                      </td>
                      <td className="px-3 py-2 text-[11px] uppercase">
                        {r.dataSource}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={validCount === 0}
            onClick={handleCommitImport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Commit {validCount} Records</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
