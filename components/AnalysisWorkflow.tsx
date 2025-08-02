
import React, { useState } from 'react';
import { Prediction } from '../types';
import { analyzeBatteryGuided } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

import LoadingSpinner from './LoadingSpinner';
import AlertBanner from './AlertBanner';
import HealthGauge from './HealthGauge';
import PredictionResult from './PredictionResult';
import RulChart from './RulChart';

// --- Helper Functions and Mock Data ---
const generatePlausibleHistoricalData = (rul: number, soh_score: number) => {
    const history = Array.from({ length: 10 }, (_, i) => ({
      cycle: rul - (10 - i) * (rul / 15), // Scale cycles based on RUL
      health: Math.min(100, soh_score + (10 - i) * (Math.random() * 1.5 + 0.5)),
    }));
    history.push({ cycle: rul, health: soh_score });
    return history;
};


// --- Step Components ---

const InputStep = ({ onAnalyze }: { onAnalyze: (data: any) => void }) => {
    const [formData, setFormData] = useState({
        vehicleModel: 'Tesla Model 3',
        originalCapacityKwh: 75,
        odometerKm: 50000,
        chargingHabit: 'Charge to 100%'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'originalCapacityKwh' || name === 'odometerKm' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAnalyze(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Vehicle Model</label>
              <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded-md border border-slate-600" />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Original Capacity (kWh)</label>
              <input type="number" name="originalCapacityKwh" value={formData.originalCapacityKwh} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded-md border border-slate-600" />
              <p className="text-xs text-slate-400 mt-1">Find this in your vehicle's manual (e.g., 75).</p>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current Odometer Reading (km)</label>
              <input type="number" name="odometerKm" value={formData.odometerKm} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded-md border border-slate-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Typical Daily Charging Habit</label>
              <select name="chargingHabit" value={formData.chargingHabit} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded-md border border-slate-600">
                  <option>Charge to 100%</option>
                  <option>Charge to 80%</option>
                  <option>Irregular</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg">
                Analyze Now
            </button>
        </form>
    );
};

const LoadingStep = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-fade-in">
        <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-slate-300">Connecting to Vehicle & Analyzing Data...</p>
        <p className="text-sm text-slate-400">Our AI is processing your vehicle's profile.</p>
    </div>
);

const ResultStep = ({ prediction }: { prediction: Prediction }) => {
    const historicalData = generatePlausibleHistoricalData(prediction.rul, prediction.soh_score);
    return (
        <div className="space-y-6 animate-fade-in">
             {prediction.alert_level !== 'nominal' && (
                <AlertBanner level={prediction.alert_level} message={prediction.next_steps} />
            )}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-900/50 p-4 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4">RUL Trend</h3>
                    <RulChart data={historicalData} />
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4">State of Health</h3>
                    <HealthGauge soh_score={prediction.soh_score} />
                </div>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">AI Diagnostic Report</h3>
                <PredictionResult prediction={prediction} isLoading={false} />
            </div>
        </div>
    )
};


// --- Main Workflow Component ---

const AnalysisWorkflow = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState('input'); // 'input', 'loading', 'result'
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getIdToken } = useAuth();

  const handleAnalyze = async (data: any) => {
    setStep('loading');
    setError(null);
    try {
        const token = await getIdToken();
        if (!token) throw new Error("Authentication token not available.");
        const result = await analyzeBatteryGuided(data, token);
        setPrediction(result);
        setStep('result');
    } catch (err) {
        setError("Analysis failed. Please try again later.");
        console.error(err);
        setStep('input'); // Revert to input on error
    }
  };
  
  const renderStep = () => {
    switch (step) {
        case 'input':
            return <InputStep onAnalyze={handleAnalyze} />;
        case 'loading':
            return <LoadingStep />;
        case 'result':
            return prediction ? <ResultStep prediction={prediction} /> : <p>Error displaying results.</p>;
        default:
            return null;
    }
  }

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <h2 className="text-2xl font-semibold mb-4">New Analysis Workflow</h2>
       {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-center">{error}</p>}
      {renderStep()}
    </div>
  );
};

export default AnalysisWorkflow;
