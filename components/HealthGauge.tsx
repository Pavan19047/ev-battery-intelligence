import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface HealthGaugeProps {
  soh_score: number;
}

const HealthGauge: React.FC<HealthGaugeProps> = ({ soh_score }) => {
  const data = [{ name: 'health', value: soh_score }];
  
  const getColor = (value: number) => {
    if (value < 50) return '#ef4444'; // red-500
    if (value < 80) return '#f59e0b'; // amber-500
    return '#22c55e'; // green-500
  };

  return (
    <div style={{ width: '100%', height: 300 }} className="relative">
      <ResponsiveContainer>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="90%"
          data={data}
          startAngle={180}
          endAngle={0}
          barSize={20}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            angleAxisId={0}
            fill={getColor(soh_score)}
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold" style={{ color: getColor(soh_score) }}>{soh_score}%</span>
        <span className="text-slate-400 text-lg">State of Health</span>
      </div>
    </div>
  );
};

export default HealthGauge;
