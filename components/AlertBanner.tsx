import React from 'react';

interface AlertBannerProps {
  level: 'warning' | 'critical';
  message: string;
}

const config = {
  warning: {
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/50',
    textColor: 'text-yellow-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: 'Safety Warning'
  },
  critical: {
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: 'CRITICAL SAFETY ALERT'
  }
};

const AlertBanner: React.FC<AlertBannerProps> = ({ level, message }) => {
  const { bgColor, borderColor, textColor, icon, title } = config[level];

  return (
    <div className={`p-4 rounded-xl border-l-4 flex items-start gap-4 animate-fade-in ${bgColor} ${borderColor} ${textColor}`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <h3 className={`font-bold text-lg ${textColor === 'text-red-300' ? 'text-red-200' : 'text-yellow-200'}`}>{title}</h3>
        <p className="text-slate-300">{message}</p>
      </div>
    </div>
  );
};

export default AlertBanner;
