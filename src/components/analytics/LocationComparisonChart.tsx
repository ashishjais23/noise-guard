import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { LocationItem, NoiseReading } from '../../types';

interface LocationComparisonChartProps {
  locations: LocationItem[];
  readings: NoiseReading[];
}

export const LocationComparisonChart: React.FC<LocationComparisonChartProps> = ({
  locations,
  readings
}) => {
  const chartData = useMemo(() => {
    return locations.map((loc) => {
      const locReadings = readings.filter((r) => r.locationId === loc.id);
      const avg = locReadings.length > 0
        ? Math.round(
            (locReadings.reduce((sum, r) => sum + r.noiseLevelDb, 0) / locReadings.length) * 10
          ) / 10
        : loc.baselineDb;

      let peak = loc.baselineDb;
      locReadings.forEach((r) => {
        if (r.noiseLevelDb > peak) peak = r.noiseLevelDb;
      });

      // Shorten label for readable chart axis
      const shortName = loc.name.split('(')[0].trim().replace('Metro Rail Phase-3 ', '');

      return {
        name: shortName,
        fullName: loc.name,
        averageDb: avg,
        peakDb: peak,
        type: loc.locationType
      };
    });
  }, [locations, readings]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Noise Level by Location
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Comparison of average (Leq) versus peak recorded decibels across all monitored zones
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              domain={[35, 100]}
              stroke="#94a3b8"
              fontSize={11}
              unit="dB"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              width={100}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg space-y-1">
                      <div className="font-semibold">{item.fullName}</div>
                      <div className="text-[11px] text-slate-400">{item.type}</div>
                      <div className="text-teal-400 font-bold font-mono">
                        Average: {item.averageDb} dB
                      </div>
                      <div className="text-rose-400 font-bold font-mono">
                        Peak: {item.peakDb} dB
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconSize={8}
            />
            <Bar dataKey="averageDb" name="Average dB (Leq)" fill="#0d9488" radius={[0, 4, 4, 0]} />
            <Bar dataKey="peakDb" name="Peak dB (Lmax)" fill="#f97316" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-2">
        Data values are illustrative for demonstration points.
      </div>
    </div>
  );
};
