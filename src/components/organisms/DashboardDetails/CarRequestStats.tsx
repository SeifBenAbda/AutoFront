import { useCarStats } from '../../../hooks/useDashboard';
import React, { useState } from 'react';
import { Bar } from 'recharts';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the props interface for the component
interface CarRequestStatsProps {
  selectedCars: string[];
}

const CarRequestStats: React.FC<CarRequestStatsProps> = ({ selectedCars }) => {
  // State for toggling between daily and monthly views
  const [timeframe, setTimeframe] = useState<'TODAY' | 'THIS_MONTH'>('TODAY');
  
  // Use the custom hook to fetch car stats
  const { data, isLoading, error } = useCarStats(selectedCars);
  
  if (isLoading) return <div className="flex justify-center p-8">Loading car statistics...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading car statistics</div>;
  if (!data) return <div className="p-4">No data available</div>;

  // Transform the data for the chart
  const transformData = () => {
    const chartData: any[] = [];
    
    // Process each car model
    Object.entries(data).forEach(([carModel, carData]) => {
      // Skip if the car has no sales data
      if ('message' in carData) return;
      
      // Create a data entry for this car model with an index signature
      const entry: { [key: string]: number | string } = {
        name: carModel,
        SARRA: 0,
        MARWA: 0,
        FIDA: 0,
      };
      
      // Add sales data for each seller
      Object.entries(carData).forEach(([seller, stats]) => {
        if (seller !== 'message') {
          entry[seller] = stats[timeframe];
        }
      });
      
      chartData.push(entry);
    });
    
    return chartData;
  };

  const chartData = transformData();

  return (
    <div className="bg-highBlue rounded-lg shadow-md p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-oswald text-whiteSecond">Vente par jour/ mois (facturé)</div>
        
        <div className="flex items-center space-x-4">
          {/* Car selection component */}
          <div className="w-64">
            
          </div>
          
          {/* Timeframe dropdown */}
          <select
            className="border rounded p-2 font-oswald text-gray-700"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as 'TODAY' | 'THIS_MONTH')}
          >
            <option value="TODAY">Quotidien</option>
            <option value="THIS_MONTH">Mensuel</option>
          </select>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-80 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 20, // Reduced left margin to reduce space
                bottom: 5,
              }}
              barSize={20}
              barGap={8}
              barCategoryGap={30}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" />
              <XAxis type="number" stroke="#FFFFFF" />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#FFFFFF"
                tick={{ fontSize: 12 }} 
                tickMargin={5} // Reduced tickMargin
                width={80} // Reduced width for the Y-axis
                dx={-10} // Shift labels to the left
              />
              <Tooltip contentStyle={{ backgroundColor: '#2A3F54', color: '#FFFFFF', border: 'none' }} 
                       labelStyle={{ color: '#FFFFFF' }}
                       itemStyle={{ color: '#FFFFFF' }} />
              <Legend wrapperStyle={{ color: '#FFFFFF' }} />
              <Bar dataKey="SARRA" fill="#4DD0E1" name="SARRA" />
              <Bar dataKey="MARWA" fill="#FF5252" name="MARWA" />
              <Bar dataKey="FIDA" fill="#FFD54F" name="FIDA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          No sales data available for the selected cars
        </div>
      )}

      {/* Display message for cars with no data */}
      <div className="mt-4">
        {Object.entries(data).map(([carModel, carData]) => (
          'message' in carData && (
            <div key={carModel} className="text-whiteSecond text-sm">
              {carModel}: {String(carData.message)}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default CarRequestStats;