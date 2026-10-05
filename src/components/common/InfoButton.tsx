import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

export interface InfoButtonProps {
  title?: string;
  content: React.ReactNode;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  align?: 'left' | 'center' | 'right';
  variant?: 'subtle' | 'outline' | 'pill';
}

export const InfoButton: React.FC<InfoButtonProps> = ({
  title = 'What does this mean?',
  content,
  size = 'sm',
  className = '',
  align = 'center',
  variant = 'subtle'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const sizeClasses = {
    xs: 'w-4 h-4 text-[11px]',
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm'
  }[size];

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5'
  }[size];

  const variantClasses = {
    subtle: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
    outline: 'border border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600 bg-white dark:bg-slate-850 text-slate-500 hover:text-slate-700 dark:text-slate-400',
    pill: 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300'
  }[variant];

  const alignClasses = {
    left: 'left-0 origin-top-left',
    center: 'left-1/2 -translate-x-1/2 origin-top',
    right: 'right-0 origin-top-right'
  }[align];

  return (
    <div ref={containerRef} className={`relative inline-flex items-center align-middle ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/50 cursor-pointer ${sizeClasses} ${variantClasses}`}
        aria-label={typeof content === 'string' ? content : title}
        title={title}
      >
        <span className="font-serif italic font-bold leading-none select-none">i</span>
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/30 sm:hidden backdrop-blur-2xs"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Desktop popover / Mobile bottom sheet */}
          <div
            className={`
              fixed bottom-4 inset-x-4 sm:bottom-auto sm:inset-x-auto sm:absolute sm:top-full sm:mt-2
              z-50 w-auto sm:w-72 max-w-[calc(100vw-2rem)]
              p-4 rounded-2xl
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-800
              shadow-xl
              text-left
              animate-in fade-in zoom-in-95 duration-150
              ${alignClasses}
            `}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{title}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {content}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
