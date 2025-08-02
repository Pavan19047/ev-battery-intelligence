
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoricalData } from '../types';

interface RulChartProps {
  data: HistoricalData[];
}

const RulChart: React.FC<RulChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="cycle" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} name="Charge Cycles"/>
          <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} domain={[70, 110]}/>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              color: '#cbd5e1'
            }}
            labelStyle={{ color: '#f1f5f9' }}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Line 
            type="monotone" 
            dataKey="health" 
            name="Health %"
            stroke="#4f46e5" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#818cf8' }}
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RulChart;
