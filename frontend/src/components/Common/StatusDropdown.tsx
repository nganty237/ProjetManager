import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { statusConfig, taskStatusConfig } from '@/utils/constants';

interface StatusDropdownProps {
  value: string;
  type?: 'project' | 'task';
  onChange: (newValue: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Custom dropdown component for selecting project or task statuses with subtle rounded styling.
 */
export function StatusDropdown({
  value,
  type = 'project',
  onChange,
  disabled = false,
  className = '',
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const configMap = type === 'project' ? statusConfig : taskStatusConfig;
  const currentConfig = (configMap as any)[value] || {
    label: value,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (disabled) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold text-xs ${currentConfig.color} ${className}`}>
        {currentConfig.icon && <span className="shrink-0">{currentConfig.icon}</span>}
        <span>{currentConfig.label}</span>
      </span>
    );
  }

  const options = Object.entries(configMap).map(([key, item]: [string, any]) => ({
    key,
    label: item.label,
    color: item.color,
    bgColor: item.bgColor,
    dotBg: item.dotBg || item.bgColor,
    hex: item.hex,
    icon: item.icon,
  }));

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 font-semibold text-xs ${currentConfig.color} cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      >
        {currentConfig.icon && <span className="shrink-0">{currentConfig.icon}</span>}
        <span>{currentConfig.label}</span>
        <ChevronDown size={13} className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-md shadow-md border border-slate-200 py-1 z-50 text-xs font-semibold">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Changer le statut
          </div>
          {options.map((opt) => {
            const isSelected = opt.key === value;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  onChange(opt.key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 transition-colors text-left ${
                  isSelected ? 'bg-slate-50 text-blue-600 font-bold' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${opt.dotBg || 'bg-slate-400'} border border-black/10`}
                    style={opt.hex ? { backgroundColor: opt.hex } : undefined}
                  />
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <Check size={14} className="text-blue-600 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StatusDropdown;
