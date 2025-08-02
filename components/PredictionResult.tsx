import React from 'react';
import { Prediction } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface PredictionResultProps {
  prediction: Prediction | null;
  isLoading: boolean;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[220px] text-center">
        <LoadingSpinner />
        <p className="mt-4 text-slate-400">The AI is analyzing the data... this may take a moment.</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="flex items-center justify-center min-h-[220px] text-center">
        <p className="text-slate-500">Run a prediction to see the AI analysis and maintenance alerts.</p>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Predicted RUL</p>
          <p className="text-2xl font-bold text-white">{prediction.rul} <span className="text-base font-normal">cycles</span></p>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Prediction Confidence</p>
          <p className="text-2xl font-bold text-white">{(prediction.confidence * 100).toFixed(1)}<span className="text-base font-normal">%</span></p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-300 mb-1">AI Analysis: Degradation Cause</h4>
        <p className="text-slate-200 p-4 bg-slate-700/50 rounded-lg border border-slate-700">{prediction.degradation_cause}</p>
      </div>

      <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4 flex items-start gap-4">
          <div className="flex-shrink-0 text-sky-400 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          </div>
          <div>
              <h4 className="font-bold text-lg text-sky-300">Pro Tip</h4>
              <p className="text-slate-300">{prediction.recommendation}</p>
          </div>
      </div>
    </div>
  );
};

export default PredictionResult;
