import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { PricePoint } from '../types';

interface PriceChartProps {
  data: PricePoint[];
  targetPrice: number;
  averagePrice: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, targetPrice, averagePrice }) => {
  if (!data || data.length === 0) return null;

  const minPrice = Math.min(...data.map(d => d.price)) * 0.9;
  const maxPrice = Math.max(...data.map(d => d.price)) * 1.1;

  return (
    <div className="w-full h-[300px] bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">6-Month Price History (Est.)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            width={60}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`$${value}`, 'Price']}
          />
          <ReferenceLine y={targetPrice} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'right', value: 'Target', fill: '#10b981', fontSize: 10 }} />
          <ReferenceLine y={averagePrice} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'right', value: 'Avg', fill: '#94a3b8', fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
