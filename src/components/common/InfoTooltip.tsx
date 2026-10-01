import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  size = 'sm',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      aria-label="More information"
      role="tooltip"
    >
      <HelpCircle
        className={`${
          size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
        } text-slate-400 hover:text-slate-600 transition-colors cursor-help`}
      />

      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <p className="leading-relaxed font-normal">{content}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
