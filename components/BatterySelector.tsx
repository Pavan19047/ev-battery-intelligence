
import React from 'react';
import { Battery } from '../types';

interface BatterySelectorProps {
  batteries: Battery[];
  selectedBatteryId: string | undefined;
  onSelect: (id: string) => void;
}

const BatterySelector: React.FC<BatterySelectorProps> = ({ batteries, selectedBatteryId, onSelect }) => {
  return (
    <div>
      <label htmlFor="battery-select" className="block text-sm font-medium text-slate-300 mb-2">
        Select EV Battery
      </label>
      <div className="relative">
        <select
          id="battery-select"
          value={selectedBatteryId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          {batteries.map((battery) => (
            <option key={battery.id} value={battery.id}>
              {battery.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BatterySelector;
