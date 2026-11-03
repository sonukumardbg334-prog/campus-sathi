import React from 'react';
import { INDIA_STATES_AND_UTS, getDistrictsByState } from '../../data/indiaGeography';
import { ChevronDown, MapPin } from 'lucide-react';

interface IndiaLocationSelectorProps {
  selectedState: string;
  selectedCity: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  className?: string;
  glassmorphism?: boolean;
  stateLabel?: string;
  cityLabel?: string;
  required?: boolean;
}

export const IndiaLocationSelector: React.FC<IndiaLocationSelectorProps> = ({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  className = '',
  glassmorphism = true,
  stateLabel,
  cityLabel,
  required = true,
}) => {
  const districts = getDistrictsByState(selectedState);

  const handleStateSelect = (newState: string) => {
    onStateChange(newState);
    const newDistricts = getDistrictsByState(newState);
    if (newDistricts.length > 0) {
      onCityChange(newDistricts[0]);
    } else {
      onCityChange('Main Campus');
    }
  };

  const selectStyle = glassmorphism
    ? 'bg-[var(--input-background)] backdrop-blur-md border border-[var(--card-border)] text-[var(--input-foreground)] focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400'
    : 'bg-[var(--input-background)] border border-[var(--card-border)] text-[var(--input-foreground)] focus:ring-2 focus:ring-blue-500';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
      {/* State / Union Territory Dropdown */}
      <div className="space-y-1">
        {stateLabel && (
          <label className="block text-xs font-semibold text-[var(--page-foreground)] mb-1">
            {stateLabel}
          </label>
        )}
        <div className="relative">
          <select
            value={selectedState}
            onChange={(e) => handleStateSelect(e.target.value)}
            required={required}
            className={`w-full px-3 py-2.5 rounded-xl appearance-none text-xs font-medium cursor-pointer transition pr-9 ${selectStyle}`}
          >
            <optgroup label="States (28)" className="bg-slate-100 text-blue-700 dark:bg-slate-900 dark:text-cyan-300 font-bold">
              {INDIA_STATES_AND_UTS.filter((s) => s.type === 'State').map((s) => (
                <option key={s.name} value={s.name} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white font-normal">
                  {s.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Union Territories (8)" className="bg-slate-100 text-teal-700 dark:bg-slate-900 dark:text-teal-300 font-bold">
              {INDIA_STATES_AND_UTS.filter((s) => s.type === 'Union Territory').map((s) => (
                <option key={s.name} value={s.name} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white font-normal">
                  {s.name} (UT)
                </option>
              ))}
            </optgroup>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* District / City Dropdown */}
      <div className="space-y-1">
        {cityLabel && (
          <label className="block text-xs font-semibold text-[var(--page-foreground)] mb-1">
            {cityLabel}
          </label>
        )}
        <div className="relative">
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            required={required}
            className={`w-full px-3 py-2.5 rounded-xl appearance-none text-xs font-medium cursor-pointer transition pr-9 ${selectStyle}`}
          >
            {districts.map((d) => (
              <option key={d} value={d} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white font-normal">
                {d}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

