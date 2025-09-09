import React, { useState, useEffect } from 'react';
import { BarChart, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, YAxis, XAxis } from 'recharts';
import { useCarStats } from '../../../hooks/useDashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../@/components/ui/select';
import CustomMultiSelect from '../../../components/atoms/CustomMultiSelect';
import { useCarModelsFacture } from '../../../hooks/useCars';
import { Loader } from 'lucide-react';


const CarRequestStats: React.FC = () => {
    const [timeframe, setTimeframe] = useState<'TODAY' | 'THIS_MONTH'>('TODAY');
    const [selectedCars, setSelectedCars] = useState<string[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    const { data: carModels } = useCarModelsFacture();
    
    // First, get all car models to make initial query
    const allCarModels = carModels?.CarModelsFacture || [];
    
    // Use all cars for initial data fetch to determine which ones have sales
    const { data, isLoading, error } = useCarStats(isInitialLoad ? allCarModels : selectedCars);

    // Auto-select cars that have sales for the current timeframe
    useEffect(() => {
        if (data && allCarModels.length > 0) {
            const carsWithSales: string[] = [];
            
            Object.entries(data).forEach(([carModel, carData]) => {
                if (!('message' in carData)) {
                    // Check if any seller has sales for the current timeframe
                    const hasSales = Object.values(carData).some(stats => stats[timeframe] > 0);
                    if (hasSales) {
                        carsWithSales.push(carModel);
                    }
                }
            });
            
            // Only update if there are cars with sales and it's different from current selection
            if (carsWithSales.length > 0 && 
                (isInitialLoad || JSON.stringify(carsWithSales.sort()) !== JSON.stringify(selectedCars.sort()))) {
                setSelectedCars(carsWithSales);
                setIsInitialLoad(false);
            }
        }
    }, [data, timeframe, allCarModels.length, isInitialLoad, selectedCars]);

    // Handle timeframe change
    const handleTimeframeChange = (newTimeframe: 'TODAY' | 'THIS_MONTH') => {
        setTimeframe(newTimeframe);
        // Reset to trigger auto-selection for new timeframe
        setIsInitialLoad(true);
    };
    // Collect only seller names with values > 0 for the current timeframe
    const getSellers = () => {
        const sellerSet = new Set<string>();
        Object.values(data || {}).forEach(carData => {
            if ('message' in carData) return;
            Object.entries(carData).forEach(([seller, stats]) => {
                if (seller !== 'message' && stats[timeframe] > 0) {
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
        <div className="bg-white border-bgColorLight rounded-2xl shadow-md p-4 w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-oswald text-highBlue">
                    Vente par jour/ mois (Facturé)
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-64">
                        <CustomMultiSelect
                            options={allCarModels}
                            defaultValue={selectedCars}
                            maxItemsToShow={1}
                            onChange={(selectedItems) => {
                                setSelectedCars(selectedItems as string[]);
                                setIsInitialLoad(false); // User manual selection, disable auto-selection
                            }}
                            optionListStyle='absolute mt-1 max-h-60 overflow-auto z-10 bg-white border border-gray-300 rounded-lg shadow-xl'
                            optionClassName='px-4 py-3 cursor-pointer hover:bg-blue-50 text-gray-800 font-medium transition-colors duration-200 border-b border-gray-100 last:border-b-0'
                            selectedOptionClassName='bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-500'
                            className="w-full border border-gray-300 bg-white text-gray-800 font-medium rounded-lg focus:border-blue-500 transition-all duration-200"
                            placeholder={selectedCars.length > 0 ? 
                                `🚗 ${selectedCars.length} sélectionnée${selectedCars.length > 1 ? 's' : ''}` 
                                : "🔍 Auto-sélection..."
                            }
                            containerClassName="w-full p-0"
                        />
                        {/* Compact selected cars display below */}
                        {selectedCars.length > 0 && (
                            <div className="mt-1 text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                                <span className="font-medium">
                                    {timeframe === 'TODAY' ? '📅 Aujourd\'hui' : '📅 Ce mois'}: 
                                </span>
                                <span className="ml-1">
                                    {selectedCars.slice(0, 2).join(', ')}
                                    {selectedCars.length > 2 && ` +${selectedCars.length - 2}`}
                                </span>
                            </div>
                        )}
                    </div>
                    <Select value={timeframe} onValueChange={handleTimeframeChange}>
                        <SelectTrigger className="w-32 border border-normalGrey bg-normalGrey text-highBlue font-oswald">
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent className="border-normalGrey bg-normalGrey cursor-pointer">
                            <SelectItem value="TODAY" className="text-highBlue font-oswald">Quotidien</SelectItem>
                            <SelectItem value="THIS_MONTH" className="text-highBlue font-oswald">Mensuel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center my-10">
                        <Loader className="h-8 w-8 animate-spin text-highBlue" />
                    </div>
            ) : error ? (
                <div className="text-red-500 p-4">Erreur de chargement des statistiques des voitures</div>
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
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis type="number" stroke="#374151" tick={{ fill: '#374151' }} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#374151"
                                tick={{ fontSize: 12, fill: '#374151' }}
                                tickMargin={5}
                                width={80}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#FFFFFF', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                                itemStyle={{ color: '#374151' }}
                            />
                            <Legend wrapperStyle={{ color: '#374151' }} />
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
                    Aucune donnée de vente disponible pour les voitures sélectionnées
                </div>
            )}

            {!isLoading && data && (
                <div className="mt-4">
                    {Object.entries(data).map(
                        ([carModel, carData]) =>
                            'message' in carData && (
                                <div key={carModel} className="text-gray-600 text-sm">
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