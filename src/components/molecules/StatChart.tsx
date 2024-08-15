// src/components/organisms/StatsChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const data = [
  { name: 'Day 1', carSales: 1000, itemChanges: 200 },
  { name: 'Day 2', carSales: 1200, itemChanges: 300 },
  { name: 'Day 3', carSales: 1500, itemChanges: 400 },
  // Add more data as needed
];

const StatsChart: React.FC = () => {
  return (
    <AreaChart width={600} height={300} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey="carSales" stackId="1" stroke="#8884d8" fill="#8884d8" />
      <Area type="monotone" dataKey="itemChanges" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
    </AreaChart>
  );
};

export default StatsChart;
