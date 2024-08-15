import React, { useState, useEffect } from 'react';
import StatCardMolecule from '../molecules/StatCard';
import StatsChart from '../molecules/StatChart'; // Import StatsChart
import { mockStats } from '../../mockData';

const DashboardStatsOrganism: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('day');

  useEffect(() => {
    fetchStats(filter);
  }, [filter]);

  const fetchStats = (filter: string) => {
    setStats(mockStats);
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setFilter('day')} className="bg-yellow-500 text-white p-2 rounded-lg">Day</button>
        <button onClick={() => setFilter('month')} className="bg-yellow-500 text-white p-2 rounded-lg">Month</button>
        <button onClick={() => setFilter('year')} className="bg-yellow-500 text-white p-2 rounded-lg">Year</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCardMolecule key={index} label={stat.label} value={stat.value} />
        ))}
      </div>
      <div className="mt-8">
        <StatsChart /> {/* Add chart component here */}
      </div>
    </div>
  );
};

export default DashboardStatsOrganism;
