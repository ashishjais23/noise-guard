import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { NoiseReading } from '../../types';

interface DailyTrendChartProps {
  readings: NoiseReading[];
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({ readings }) => {
  const chartData = useMemo(() => {
    // Group readings into 1-hour bins over the past 24 hours
    const hourlyBins: Record<number, { sum: number; count: number; max: number }> = {};
    for (let h = 0; h < 24; h++) {
      hourlyBins[h] = { sum: 0, count: 0, max: 0 };
    }

    readings.forEach((r) => {
      const hour = new Date(r.timestamp).getHours();
      hourlyBins[hour].sum += r.noiseLevelDb;
      hourlyBins[hour].count += 1;
      if (r.noiseLevelDb > hourlyBins[hour].max) {
        hourlyBins[hour].max = r.noiseLevelDb;
      }
    });

    return Object.entries(hourlyBins).map(([hStr, stat]) => {
      const h = parseInt(hStr, 10);
      const timeLabel = `${h.toString().padStart(2, '0')}:00`;
      return {
        hour: timeLabel,
        averageDb: stat.count > 0 ? Math.round((stat.sum / stat.count) * 10) / 10 : 50,
        peakDb: stat.max > 0 ? stat.max : 55
      };
    });
  }, [readings]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800">
          24-Hour Diurnal Progression
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Hourly composite profile tracking urban acoustic rise and fall across day-night cycles
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="hour"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              domain={[35, 95]}
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
                      <div className="font-semibold">{item.hour}</div>
                      <div className="text-teal-400 font-bold font-mono">
                        Hourly Average: {item.averageDb} dB
                      </div>
                      <div className="text-amber-400 font-mono text-[11px]">
                        Peak in Hour: {item.peakDb} dB
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="averageDb"
              stroke="#0d9488"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAvg)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          <span>Composite Urban Diurnal Average</span>
        </span>
        <span className="text-[11px] text-slate-400">
          Reflects morning and evening transit peaks
        </span>
      </div>
    </div>
  );
};
