import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { NoiseReading, ProjectThresholds } from '../../types';
import { Sparkles, Calendar } from 'lucide-react';

interface LiveNoiseChartProps {
  readings: NoiseReading[];
  thresholds: ProjectThresholds;
  selectedLocationId?: string;
}

export const LiveNoiseChart: React.FC<LiveNoiseChartProps> = ({
  readings,
  thresholds,
  selectedLocationId
}) => {
  const [timeframe, setTimeframe] = useState<'1h' | '6h' | '24h'>('1h');

  // Filter and format chart data based on timeframe & selected location
  const chartData = useMemo(() => {
    const now = Date.now();
    const timeframeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000
    }[timeframe];

    let filtered = readings.filter(
      (r) => now - new Date(r.timestamp).getTime() <= timeframeMs
    );

    if (selectedLocationId) {
      filtered = filtered.filter((r) => r.locationId === selectedLocationId);
    }

    // Sort chronologically
    filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Map to chart items
    return filtered.map((r) => {
      const d = new Date(r.timestamp);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: timeframe === '1h' ? '2-digit' : undefined });
      return {
        time: timeStr,
        db: r.noiseLevelDb,
        l10: r.l10 || Math.round((r.noiseLevelDb + 2.5) * 10) / 10,
        l90: r.l90 || Math.round((r.noiseLevelDb - 4.0) * 10) / 10,
        lmax: r.lmax || Math.round((r.noiseLevelDb + 5.0) * 10) / 10,
        context: r.acousticContext,
        location: r.locationName,
        source: r.dataSource
      };
    });
  }, [readings, timeframe, selectedLocationId]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">
              Noise Level Over Time
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              <Sparkles className="w-2.5 h-2.5 text-purple-500" />
              Simulated data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time equivalent sound pressure level tracking (Leq)
          </p>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          {(['1h', '6h', '24h'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                timeframe === tf
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tf === '1h' ? '1 Hour' : tf === '6h' ? '6 Hours' : '24 Hours'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No readings recorded for the selected timeframe.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                domain={[35, 105]}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                unit="dB"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl text-xs shadow-xl space-y-1.5 max-w-[280px]">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-1">
                          <span className="font-semibold text-slate-200">{item.time}</span>
                          <span className="text-slate-400 text-[10px] uppercase font-mono">
                            {item.source}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-slate-400 text-[11px]">Leq (Sound Level):</span>
                          <span className="text-teal-400 font-bold font-mono text-base">
                            {item.db} dBA
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono gap-3 pt-0.5">
                          <span>L10: <strong className="text-amber-400">{item.l10} dB</strong></span>
                          <span>L90: <strong className="text-emerald-400">{item.l90} dB</strong></span>
                        </div>
                        {item.context && (
                          <div className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-700/60 leading-tight">
                            &ldquo;{item.context}&rdquo;
                          </div>
                        )}
                        {item.location && (
                          <div className="text-[10px] text-slate-400 truncate">
                            {item.location}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Threshold Lines */}
              <ReferenceLine
                y={thresholds.moderateMax}
                stroke="#ea580c"
                strokeDasharray="4 4"
                label={{
                  value: `High Threshold (${thresholds.moderateMax} dB)`,
                  fill: '#ea580c',
                  fontSize: 10,
                  position: 'insideTopRight'
                }}
              />
              <ReferenceLine
                y={thresholds.highMax}
                stroke="#dc2626"
                strokeDasharray="3 3"
                label={{
                  value: `Critical (${thresholds.highMax} dB)`,
                  fill: '#dc2626',
                  fontSize: 10,
                  position: 'insideTopRight'
                }}
              />

              <Line
                type="monotone"
                dataKey="db"
                stroke="#0d9488"
                strokeWidth={2.2}
                dot={timeframe === '1h'}
                activeDot={{ r: 6, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Footer Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-teal-600 rounded-full" />
            <span>Measured Sound Level (dB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-orange-600" />
            <span>Project High Limit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-rose-600" />
            <span>Project Critical Limit</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400">
          Thresholds customizable in Settings
        </span>
      </div>
    </div>
  );
};
