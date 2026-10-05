import React from 'react';
import { NoiseSeverity } from '../../types';
import { ShieldCheck, AlertCircle, AlertTriangle, Flame } from 'lucide-react';

interface NoiseStatusBadgeProps {
  severity: NoiseSeverity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const NoiseStatusBadge: React.FC<NoiseStatusBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const config = {
    Safe: {
      label: 'Safe',
      icon: <ShieldCheck className="shrink-0" />,
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
    },
    Moderate: {
      label: 'Moderate',
      icon: <AlertCircle className="shrink-0" />,
      classes: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
    },
    High: {
      label: 'High Noise',
      icon: <AlertTriangle className="shrink-0" />,
      classes: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800'
    },
    Critical: {
      label: 'Critical',
      icon: <Flame className="shrink-0" />,
      classes: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
    }
  }[severity];

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs ${config.classes} ${sizeClasses} ${className}`}
    >
      {showIcon && React.cloneElement(config.icon, { className: `${iconSizes} shrink-0` })}
      <span>{config.label}</span>
    </span>
  );
};
