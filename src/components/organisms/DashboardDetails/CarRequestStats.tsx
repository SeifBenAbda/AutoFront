import React, { useState } from 'react';
import { BarChart, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, YAxis, XAxis } from 'recharts';
import { useCarStats } from '../../../hooks/useDashboard';

interface CarRequestStatsProps {
    selectedCars: string[];
}

const CarRequestStats: React.FC<CarRequestStatsProps> = ({ selectedCars }) => {
    const [timeframe, setTimeframe] = useState<'TODAY' | 'THIS_MONTH'>('TODAY');
    const { data, isLoading, error } = useCarStats(selectedCars);

    // Collect all seller names from the data (skip if there is a "message")
    const getSellers = () => {
        const sellerSet = new Set<string>();
        Object.values(data || {}).forEach(carData => {
            if ('message' in carData) return;
            Object.keys(carData).forEach(seller => {
                if (seller !== 'message') {
                    sellerSet.add(seller);
                }
            });
        });
        return Array.from(sellerSet);
    };

    const sellers = getSellers();

    // Transform the data for the chart using the dynamic seller list
    const transformData = () => {
        const chartData: { [key: string]: number | string }[] = [];
        Object.entries(data || {}).forEach(([carModel, carData]) => {
            if ('message' in carData) return;
            // Initialize all seller values to 0
            const entry: { [key: string]: number | string } = { name: carModel };
            sellers.forEach(seller => {
                entry[seller] = 0;
            });
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

    // Define some colors to cycle through; add more if needed.
    const colors = ['#4DD0E1', '#FF5252', '#FFD54F', '#81C784', '#7986CB', '#F06292'];

    return (
        <div className="bg-highBlue rounded-lg shadow-md p-4 w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-oswald text-whiteSecond">
                    Vente par jour/ mois (facturé)
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-64">{/* Car selection component */}</div>
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

            {isLoading ? (
                <div className="flex justify-center items-center h-80">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin" />
                </div>
            ) : error ? (
                <div className="text-red-500 p-4">Error loading car statistics</div>
            ) : data && chartData.length > 0 ? (
                <div className="h-80 mt-4 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 20,
                                left: 20,
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
                                tickMargin={5}
                                width={80}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2A3F54', color: '#FFFFFF', border: 'none' }}
                                labelStyle={{ color: '#FFFFFF' }}
                                itemStyle={{ color: '#FFFFFF' }}
                            />
                            <Legend wrapperStyle={{ color: '#FFFFFF' }} />
                            {sellers.map((seller, index) => (
                                <Bar
                                    key={seller}
                                    dataKey={seller}
                                    fill={colors[index % colors.length]}
                                    name={seller}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                    No sales data available for the selected cars
                </div>
            )}

            {!isLoading && data && (
                <div className="mt-4">
                    {Object.entries(data).map(
                        ([carModel, carData]) =>
                            'message' in carData && (
                                <div key={carModel} className="text-whiteSecond text-sm">
                                    {carModel}: {String(carData.message)}
                                </div>
                            )
                    )}
                </div>
            )}
        </div>
    );
};

export default CarRequestStats;
