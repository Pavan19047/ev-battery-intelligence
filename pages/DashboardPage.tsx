
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AnalysisWorkflow from '../components/AnalysisWorkflow';

// Mock data for past reports
const mockPastReports = [
  { id: 1, vehicle: 'Tesla Model S (Worn)', date: '2024-05-10', soh: 82, alert: 'warning' },
  { id: 2, vehicle: 'Chevy Bolt (New)', date: '2024-04-22', soh: 99, alert: 'nominal' },
];

const DashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isAnalysisVisible, setAnalysisVisible] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {currentUser?.email?.split('@')[0]}!</h1>
          <p className="text-slate-400">Your central hub for battery health analysis.</p>
        </div>
        <button onClick={logout} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Logout
        </button>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Start New Analysis</h2>
          <button 
            onClick={() => setAnalysisVisible(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/50 transform hover:-translate-y-0.5"
          >
            Get Started
          </button>
        </div>
        <p className="text-slate-400">
          Begin our new guided workflow to get a detailed predictive analysis of your EV's battery health.
        </p>
      </div>

      {isAnalysisVisible && (
        <AnalysisWorkflow onClose={() => setAnalysisVisible(false)} />
      )}

      <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Analysis History</h2>
          <div className="space-y-3">
            {mockPastReports.map(report => (
              <div key={report.id} className="bg-slate-700/50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold">{report.vehicle}</p>
                  <p className="text-sm text-slate-400">{report.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{report.soh}% SoH</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.alert === 'warning' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                    {report.alert}
                  </span>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default DashboardPage;
