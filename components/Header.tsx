
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
             <div className="text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              EV Battery <span className="text-indigo-400">Intelligence</span>
            </h1>
          </div>
           <div className="text-xs text-slate-400">By The Falcons</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
