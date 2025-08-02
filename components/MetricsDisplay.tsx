
import React from 'react';
import { BatteryMetrics } from '../types';
import { IconVoltage, IconCurrent, IconTemperature } from './IconComponents';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  colorClass: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, unit, colorClass }) => (
  <div className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-4 border border-slate-700 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800 transform hover:-translate-y-1">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value} <span className="text-lg font-normal text-slate-300">{unit}</span>
      </p>
    </div>
  </div>
);

interface MetricsDisplayProps {
  metrics: BatteryMetrics | null;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <p>Loading metrics...</p>
      </div>
    );
  }

  return (
    <div>
        <h3 className="text-xl font-semibold mb-4 text-slate-200">Real-Time Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <MetricCard
            icon={<IconVoltage />}
            label="Voltage"
            value={metrics.voltage.toFixed(2)}
            unit="V"
            colorClass="bg-yellow-500/20 text-yellow-400"
        />
        <MetricCard
            icon={<IconCurrent />}
            label="Current"
            value={metrics.current.toFixed(2)}
            unit="A"
            colorClass="bg-sky-500/20 text-sky-400"
        />
        <MetricCard
            icon={<IconTemperature />}
            label="Temperature"
            value={metrics.temperature.toFixed(1)}
            unit="°C"
            colorClass="bg-red-500/20 text-red-400"
        />
        </div>
    </div>
  );
};

export default MetricsDisplay;
