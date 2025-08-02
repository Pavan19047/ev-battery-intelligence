import React from 'react';
import { Battery, Prediction, BatteryMetrics, HistoricalData } from '../types';
import MetricsDisplay from './MetricsDisplay';
import PredictionResult from './PredictionResult';
import RulChart from './RulChart';
import HealthGauge from './HealthGauge';
import AlertBanner from './AlertBanner';

interface DashboardProps {
  battery: Battery | null;
  metrics: BatteryMetrics | null;
  prediction: Prediction | null;
  isLoading: boolean;
  historicalData: HistoricalData[];
}

const Placeholder: React.FC<{ message: string }> = ({ message }) => (
    <div className="h-full min-h-[200px] flex items-center justify-center bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-700">
        <p className="text-slate-500 text-lg">{message}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ battery, metrics, prediction, isLoading, historicalData }) => {
  if (!battery) {
    return <div className="text-center text-xl">Please select a battery to begin.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">{battery.name}</h2>
        <p className="text-slate-400 mt-1">{battery.model}</p>
      </div>

      {prediction && prediction.alert_level !== 'nominal' && (
        <AlertBanner level={prediction.alert_level} message={prediction.next_steps} />
      )}
      
      <div className="animate-fade-in">
        <MetricsDisplay metrics={metrics} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 transition-all duration-300 hover:border-slate-600">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Remaining Useful Life (RUL) Trend</h3>
          {isLoading ? <Placeholder message="Analyzing historical data..." /> : prediction ? <RulChart data={historicalData} /> : <Placeholder message="Run prediction to see RUL trend" />}
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 transition-all duration-300 hover:border-slate-600">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">State of Health (SoH)</h3>
            {isLoading ? <Placeholder message="Calculating health..." /> : prediction ? <HealthGauge soh_score={prediction.soh_score} /> : <Placeholder message="Run prediction to see health" />}
        </div>
      </div>
      
      <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 transition-all duration-300 hover:border-slate-600">
         <h3 className="text-xl font-semibold mb-4 text-slate-200">AI Diagnostic Report</h3>
         <PredictionResult prediction={prediction} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
