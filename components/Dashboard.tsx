// src/components/Dashboard.tsx
import React from 'react';
import { Battery, Prediction, BatteryMetrics, HistoricalData } from '../types';
import BatterySimulation from './BatterySimulation'; // The new 3D component
import MetricsDisplay from './MetricsDisplay';
import PredictionResult from './PredictionResult';
import RulChart from './RulChart';
import HealthGauge from './HealthGauge';
import AlertBanner from './AlertBanner';
import LoadingSpinner from './LoadingSpinner'; // Assuming a loading spinner component exists

interface DashboardProps {
  battery: Battery | null;
  metrics: BatteryMetrics | null;
  prediction: Prediction | null;
  isLoading: boolean;
  historicalData: HistoricalData[];
}

// A default state for the simulation before an analysis is run
const defaultPredictionState: Prediction = {
    rul: 0,
    soh_score: 100,
    alert_level: 'nominal',
    degradation_cause: 'Awaiting analysis...',
    recommendation: 'Run prediction to get personalized recommendations.',
    next_steps: '',
    confidence: 0
};

const Dashboard: React.FC<DashboardProps> = ({ battery, metrics, prediction, isLoading, historicalData }) => {
  if (!battery) {
    return <div className="text-center text-xl text-slate-400">Please select a battery to begin.</div>;
  }

  // Use the real prediction result if it's available, otherwise use the default state for the initial view.
  const simulationData = prediction || defaultPredictionState;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">{battery.name}</h2>
        <p className="text-slate-400 mt-1">{battery.model}</p>
      </div>

      {prediction && prediction.alert_level !== 'nominal' && (
        <AlertBanner level={prediction.alert_level} message={prediction.next_steps || 'Immediate action recommended.'} />
      )}
      
      {/* Display current metrics at the top */}
      <MetricsDisplay metrics={metrics} />

      {/* --- START: 3D Simulation Integration (FIXED) --- */}
      {/* THE FIX, PART 1: An explicit height class `h-96` is added here.
        This guarantees that a container for the 3D canvas is allocated in the page layout.
      */}
      <div className="bg-slate-900/70 p-4 rounded-xl shadow-2xl border border-slate-700 relative h-96">
         <h3 className="text-xl font-semibold mb-4 text-slate-200 px-2">Digital Twin Visualization</h3>
         
         <BatterySimulation analysisResult={{
           soh_percentage: simulationData.soh_score,
           rul_cycles: simulationData.rul,
           alert_level: simulationData.alert_level as 'nominal' | 'warning' | 'critical'
         }} />

         {isLoading && (
            <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm z-10">
                <LoadingSpinner />
                <p className="text-slate-300 mt-4 text-lg">Analyzing... Please wait.</p>
            </div>
         )}
      </div>
      {/* --- END: 3D Simulation Integration --- */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 transition-all duration-300 hover:border-slate-600">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Remaining Useful Life (RUL) Trend</h3>
          {prediction ? <RulChart data={historicalData} /> : <div className="h-full min-h-[200px] flex items-center justify-center"><p className="text-slate-500">Run prediction to see RUL trend.</p></div>}
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 transition-all duration-300 hover:border-slate-600">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">State of Health (SoH)</h3>
            {prediction ? <HealthGauge soh_score={prediction.soh_score} /> : <div className="h-full min-h-[200px] flex items-center justify-center"><p className="text-slate-500">Run prediction to see health.</p></div>}
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
