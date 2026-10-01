import React from 'react';
import { DataSourceBadge } from './DataSourceBadge';
import { DataSource } from '../../types';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  dataSource?: DataSource;
  trendText?: string;
  trendColor?: 'green' | 'red' | 'neutral';
  tooltipText?: string;
  isSimulated?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  dataSource,
  trendText,
  trendColor = 'neutral',
  tooltipText,
  isSimulated = true
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {title}
          </span>
          {subtitle && (
            <span className="text-[11px] text-slate-400 block line-clamp-1">
              {subtitle}
            </span>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-teal-600 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="my-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-500">
            {unit}
          </span>
        )}
      </div>

      {/* Bottom Footer with Tag and Trend */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1 text-xs">
        {trendText ? (
          <span
            className={`font-medium ${
              trendColor === 'green'
                ? 'text-emerald-600'
                : trendColor === 'red'
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}
          >
            {trendText}
          </span>
        ) : (
          <span className="text-slate-400 text-[11px]">
            {tooltipText || 'Continuously evaluated'}
          </span>
        )}

        {dataSource ? (
          <DataSourceBadge source={dataSource} size="sm" />
        ) : isSimulated ? (
          <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 uppercase tracking-wider font-medium">
            Simulated
          </span>
        ) : null}
      </div>
    </div>
  );
};
