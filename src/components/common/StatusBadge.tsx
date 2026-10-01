import React from 'react';
import { NoiseSeverity } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Flame } from 'lucide-react';

interface StatusBadgeProps {
  severity: NoiseSeverity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getStyles = () => {
    switch (severity) {
      case 'Safe':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
          label: 'Safe'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
          label: 'Moderate'
        };
      case 'High':
        return {
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          dot: 'bg-orange-500',
          icon: <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />,
          label: 'High'
        };
      case 'Critical':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300 font-semibold',
          dot: 'bg-rose-600 animate-pulse',
          icon: <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
          label: 'Critical'
        };
    }
  };

  const style = getStyles();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${style.bg} ${sizeClasses} ${className}`}
    >
      {showIcon ? (
        style.icon
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      )}
      <span>{style.label}</span>
    </span>
  );
};
