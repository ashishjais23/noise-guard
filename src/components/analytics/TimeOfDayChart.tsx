import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { NoiseReading } from '../../types';

interface TimeOfDayChartProps {
  readings: NoiseReading[];
}

export const TimeOfDayChart: React.FC<TimeOfDayChartProps> = ({ readings }) => {
  const data = useMemo(() => {
    const buckets: Record<string, { sum: number; count: number; max: number }> = {
      'Morning\n(06:00-12:00)': { sum: 0, count: 0, max: 0 },
      'Afternoon\n(12:00-18:00)': { sum: 0, count: 0, max: 0 },
      'Evening\n(18:00-22:00)': { sum: 0, count: 0, max: 0 },
      'Night\n(22:00-06:00)': { sum: 0, count: 0, max: 0 }
    };

    readings.forEach((r) => {
      const hour = new Date(r.timestamp).getHours();
      let key = 'Night\n(22:00-06:00)';
      if (hour >= 6 && hour < 12) key = 'Morning\n(06:00-12:00)';
      else if (hour >= 12 && hour < 18) key = 'Afternoon\n(12:00-18:00)';
      else if (hour >= 18 && hour < 22) key = 'Evening\n(18:00-22:00)';

      buckets[key].sum += r.noiseLevelDb;
      buckets[key].count += 1;
      if (r.noiseLevelDb > buckets[key].max) {
        buckets[key].max = r.noiseLevelDb;
      }
    });

    return Object.entries(buckets).map(([period, stat]) => ({
      period,
      averageDb: stat.count > 0 ? Math.round((stat.sum / stat.count) * 10) / 10 : 0,
      peakDb: stat.max,
      samples: stat.count
    }));
  }, [readings]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Noise by Time of Day
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Diurnal acoustic distribution across morning, afternoon, evening, and night intervals
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="period"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              domain={[30, 95]}
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
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg space-y-1">
                      <div className="font-semibold">{item.period.replace('\n', ' ')}</div>
                      <div className="text-teal-400 font-bold font-mono">
                        Avg: {item.averageDb} dB
                      </div>
                      <div className="text-rose-400 font-mono text-[11px]">
                        Peak: {item.peakDb} dB
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Samples: {item.samples}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="averageDb" fill="#0d9488" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.averageDb >= 75
                      ? '#ea580c'
                      : entry.averageDb >= 65
                      ? '#0d9488'
                      : '#10b981'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
        <span>Bars colored by acoustic category</span>
        <span className="font-mono text-[11px]">Energy Equivalent Leq</span>
      </div>
    </div>
  );
};
