import React, { useState, useMemo } from 'react';
import { format, differenceInDays, isSameDay } from 'date-fns';
import { PlanningRappelData, usePlanningRappels } from '../../../hooks/useDashboard';
import CustomPagination from '../../../components/atoms/CustomPagination';
import { DatePicker } from '../../../components/atoms/DateSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../@/components/ui/tabs";
import { Calendar } from "../../../@/components/ui/calendar";
import { Badge } from "../../../@/components/ui/badge";
import { Card, CardContent } from "../../../@/components/ui/card";

// Define display modes for different visualizations
type ViewMode = 'calendar' | 'cards' | 'table';

const PlanningRappelComponent: React.FC = () => {
    // Default date range
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const [page, setPage] = useState<number>(1);
    const [startingDate, setStartingDate] = useState<Date>(today);
    const [endingDate, setEndingDate] = useState<Date>(nextWeek);
    const [selectedCreator, setSelectedCreator] = useState<string>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('cards');

    const { data, isLoading, isError, error } = usePlanningRappels(page, startingDate, endingDate, selectedCreator);

    // Get unique creators for dropdown
    const creators = useMemo(() => {
        if (!data?.result?.allCreators) return [];
        return ['all', ...data.result.allCreators];
    }, [data?.result?.allCreators]);

    // Get all rappels flattened for easier rendering
    const allRappels = useMemo(() => {
        if (!data?.result?.rappelsByCreator || !data?.result?.allCreators) return [];
        
        return data.result.allCreators
            .filter(creator => selectedCreator === 'all' || creator === selectedCreator)
            .flatMap(creator => 
                (data.result.rappelsByCreator[creator] || []).map(rappel => ({
                    ...rappel,
                    creator
                }))
            )
            .sort((a, b) => new Date(a.rappelDate).getTime() - new Date(b.rappelDate).getTime());
    }, [data?.result, selectedCreator]);

    // Generate dates for calendar with rappel counts
    const calendarDates = useMemo(() => {
        const dateMap = new Map();
        
        allRappels.forEach(rappel => {
            const dateStr = format(new Date(rappel.rappelDate), 'yyyy-MM-dd');
            if (dateMap.has(dateStr)) {
                dateMap.set(dateStr, dateMap.get(dateStr) + 1);
            } else {
                dateMap.set(dateStr, 1);
            }
        });
        
        return dateMap;
    }, [allRappels]);

    // Helper to get urgency level based on date proximity
    const getUrgencyClass = (date: string | Date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const days = differenceInDays(dateObj, today);
        if (days < 0) return "bg-red-100 border-red-300 text-red-800"; // Past due
        if (days <= 2) return "bg-orange-100 border-orange-300 text-orange-800"; // Urgent
        if (days <= 5) return "bg-yellow-100 border-yellow-300 text-yellow-800"; // Soon
        return "bg-green-100 border-green-300 text-green-800"; // Normal
    };

    // Get creator-specific color
    const getCreatorColor = (creator: string) => {
        // Simple hash function to generate consistent colors for creators
        const hash = creator.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 65%)`;
    };

    return (
        <div className="w-full max-w-full bg-highGrey rounded-md shadow-md p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="text-2xl text-whiteSecond font-oswald">
                    Planning des appels
                </div>
                
                {/* Creator filter - this stays in the header for all views */}
                <div className="flex items-center gap-2 ml-auto">
                    <label className="text-whiteSecond whitespace-nowrap">Créateur:</label>
                    <Select 
                        onValueChange={(value) => setSelectedCreator(value)} 
                        defaultValue={selectedCreator}
                    >
                        <SelectTrigger className="w-40 border border-normalGrey bg-normalGrey font-oswald">
                            <SelectValue placeholder="Tous les Créateurs" />
                        </SelectTrigger>
                        <SelectContent className="bg-normalGrey border-normalGrey">
                            {creators.map(creator => (
                                <SelectItem 
                                    key={creator} 
                                    value={creator} 
                                    className="hover:bg-highGrey hover:text-whiteSecond transition-colors"
                                >
                                    {creator === 'all' ? 'Tous les Créateurs' : creator}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="mb-6">
                <TabsList className="grid grid-cols-3 mb-4 bg-normalGrey">
                    <TabsTrigger value="calendar" className="text-whiteSecond data-[state=active]:bg-whiteSecond data-[state=active]:text-highBlue">
                        Calendrier
                    </TabsTrigger>
                    <TabsTrigger value="cards" className="text-whiteSecond data-[state=active]:bg-whiteSecond data-[state=active]:text-highBlue">
                        Cartes
                    </TabsTrigger>
                    <TabsTrigger value="table" className="text-whiteSecond data-[state=active]:bg-whiteSecond data-[state=active]:text-highBlue">
                        Tableau
                    </TabsTrigger>
                </TabsList>

                {/* Calendar View */}
                <TabsContent value="calendar" className="mt-4">
                    {isError ? (
                        <div className="text-center py-4 text-red-500">
                            Erreur: {error?.message || 'Aucune donnée trouvée'}
                        </div>
                    ) : isLoading ? (
                        <div className="flex justify-center">
                            <div className="animate-pulse w-full h-96 bg-gray-200 rounded"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg p-4">
                            <div className="flex flex-col md:flex-row gap-4 justify-between">
                                {/* Date picker section */}
                                <div className="md:w-1/2">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Date sélectionnée</h3>
                                    <div className="p-4 border rounded-md bg-gray-50">
                                        <DatePicker
                                            fromYear={new Date().getFullYear() - 1}
                                            toYear={new Date().getFullYear() + 1}
                                            value={startingDate as any}
                                            onChange={(date: any) => setStartingDate(date || today)}
                                        />
                                    </div>
                                    
                                    {/* Event count summary */}
                                    <div className="mt-4 p-3 border rounded-md">
                                        <h4 className="font-medium mb-2 text-gray-700">Récapitulatif des rendez-vous</h4>
                                        <div className="space-y-1">
                                            {Array.from(calendarDates.entries())
                                                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                                                .slice(0, 5)
                                                .map(([dateStr, count]) => {
                                                    const date = new Date(dateStr);
                                                    const urgencyClass = getUrgencyClass(date);
                                                    return (
                                                        <div 
                                                            key={dateStr}
                                                            className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50"
                                                            onClick={() => setStartingDate(date)}
                                                        >
                                                            <span className="font-medium">{format(date, 'dd/MM/yyyy')}</span>
                                                            <Badge 
                                                                variant="outline" 
                                                                className={`${urgencyClass} px-2 py-1 rounded-md`}
                                                            >
                                                                {count} rappel{count > 1 ? 's' : ''}
                                                            </Badge>
                                                        </div>
                                                    );
                                                })
                                            }
                                            {calendarDates.size === 0 && (
                                                <div className="text-gray-500 italic text-center py-2">
                                                    Aucun rendez-vous dans cette période
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Daily appointments panel */}
                                <div className="md:w-1/2">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                        Rendez-vous du {format(startingDate, 'dd/MM/yyyy')}
                                    </h3>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto p-1">
                                        {allRappels
                                            .filter(rappel => isSameDay(new Date(rappel.rappelDate), startingDate))
                                            .map((rappel, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-3 rounded-md border shadow-sm hover:shadow-md transition-shadow bg-white"
                                                    style={{ borderLeftColor: getCreatorColor(rappel.creator), borderLeftWidth: '4px' }}
                                                >
                                                    <div className="flex justify-between mb-2">
                                                        <div className="font-semibold">{rappel.clientName}</div>
                                                        <Badge className="bg-gray-100 text-gray-700">
                                                            {rappel.creator}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-600">{rappel.carType}</div>
                                                </div>
                                            ))}
                                        {allRappels.filter(rappel => isSameDay(new Date(rappel.rappelDate), startingDate)).length === 0 && (
                                            <div className="text-gray-500 italic text-center p-6 border border-dashed rounded-md">
                                                Aucun rendez-vous prévu pour cette date
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Cards View */}
                <TabsContent value="cards" className="mt-4">
                    {isError ? (
                        <div className="text-center py-4 text-red-500">
                            Erreur: {error?.message || 'Aucune donnée trouvée'}
                        </div>
                    ) : isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-gray-100 animate-pulse h-40 rounded-lg"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {allRappels.length > 0 ? allRappels.map((rappel, idx) => {
                                    const rappelDate = new Date(rappel.rappelDate);
                                    const urgencyClass = getUrgencyClass(rappel.rappelDate);
                                    const creatorColor = getCreatorColor(rappel.creator);
                                    
                                    return (
                                        <Card key={idx} className="overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow">
                                            <div className="h-2" style={{ backgroundColor: creatorColor }}></div>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-lg mb-1">{rappel.clientName}</h3>
                                                        <div className="text-sm text-gray-600 mb-2">{rappel.carType}</div>
                                                    </div>
                                                    <Badge variant="outline" className={`${urgencyClass} px-2 py-1 rounded-md`}>
                                                        {format(rappelDate, 'dd/MM/yyyy')}
                                                    </Badge>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                                    <div className="text-sm font-medium">
                                                        Créateur: <span className="text-gray-600">{rappel.creator}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {differenceInDays(rappelDate, today) === 0 
                                                            ? "Aujourd'hui" 
                                                            : differenceInDays(rappelDate, today) === 1 
                                                                ? "Demain" 
                                                                : differenceInDays(rappelDate, today) === -1 
                                                                    ? "Hier"
                                                                    : differenceInDays(rappelDate, today) < 0 
                                                                        ? `Il y a ${Math.abs(differenceInDays(rappelDate, today))} jours`
                                                                        : `Dans ${differenceInDays(rappelDate, today)} jours`
                                                        }
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                }) : (
                                    <div className="col-span-3 text-center py-8 text-gray-500">
                                        Aucun rendez-vous trouvé pour cette période
                                    </div>
                                )}
                            </div>
                            
                            {/* Pagination for Cards View */}
                            <div className="mt-6">
                                <CustomPagination
                                    currentPage={page}
                                    totalPages={data?.meta.totalPages || 0}
                                    onPageChange={(newPage) => setPage(newPage)}
                                    containerClassName="flex items-center justify-center mt-4 space-x-2"
                                    previousButtonClassName="px-3 py-1 bg-transparent text-gray-600 rounded disabled:opacity-50"
                                    nextButtonClassName="px-3 py-1 bg-transparent text-gray-600 rounded disabled:opacity-50"
                                    activePageClassName="bg-highBlue text-white"
                                    inactivePageClassName="bg-transparent text-gray-600"
                                    dotClassName="px-3 py-1 text-gray-600"
                                />
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* Table View (Enhanced) */}
                <TabsContent value="table" className="mt-4">
                    {/* Date range selection - only in table view */}
                    <div className="flex flex-wrap gap-4 items-center mb-4 bg-white p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-gray-700 whitespace-nowrap">Du:</label>
                                <DatePicker
                                    fromYear={today.getFullYear()}
                                    toYear={new Date().getFullYear() + 1}
                                    value={startingDate as any}
                                    onChange={(date: any) => setStartingDate(date || today)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-gray-700 whitespace-nowrap">Au:</label>
                                <DatePicker
                                    fromYear={new Date().getFullYear() - 5}
                                    toYear={new Date().getFullYear() + 1}
                                    value={endingDate as any}
                                    onChange={(date: any) => setEndingDate(date || nextWeek)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium text-gray-600">Créateur</th>
                                    <th className="px-6 py-3 text-left font-medium text-gray-600">Client</th>
                                    <th className="px-6 py-3 text-left font-medium text-gray-600">Type de Voiture</th>
                                    <th className="px-6 py-3 text-left font-medium text-gray-600">Date</th>
                                    <th className="px-6 py-3 text-left font-medium text-gray-600">Délai</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {isError ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-red-500">
                                            Erreur: {error?.message || 'Aucune donnée trouvée'}
                                        </td>
                                    </tr>
                                ) : isLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index} className="animate-pulse">
                                            {Array.from({ length: 5 }).map((__, cellIndex) => (
                                                <td key={cellIndex} className="px-6 py-4">
                                                    <div className="bg-gray-200 rounded h-4 w-28"></div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : allRappels.length > 0 ? (
                                    allRappels.map((rappel, idx) => {
                                        const rappelDate = new Date(rappel.rappelDate);
                                        const days = differenceInDays(rappelDate, today);
                                        let statusText = "";
                                        let statusClass = "";
                                        
                                        if (days < 0) {
                                            statusText = "En retard";
                                            statusClass = "text-red-600 bg-red-50";
                                        } else if (days === 0) {
                                            statusText = "Aujourd'hui";
                                            statusClass = "text-orange-600 bg-orange-50";
                                        } else if (days === 1) {
                                            statusText = "Demain";
                                            statusClass = "text-yellow-600 bg-yellow-50";
                                        } else if (days <= 3) {
                                            statusText = `Dans ${days} jours`;
                                            statusClass = "text-yellow-600 bg-yellow-50";
                                        } else {
                                            statusText = `Dans ${days} jours`;
                                            statusClass = "text-green-600 bg-green-50";
                                        }
                                        
                                        return (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span
                                                        className="inline-block w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: getCreatorColor(rappel.creator) }}
                                                    ></span>
                                                    {rappel.creator}
                                                </td>
                                                <td className="px-6 py-4 font-medium">{rappel.clientName}</td>
                                                <td className="px-6 py-4">{rappel.carType}</td>
                                                <td className="px-6 py-4">{format(rappelDate, 'dd/MM/yyyy')}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
                                                        {statusText}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-gray-500">
                                            Aucun rendez-vous trouvé pour cette période
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination - only in table view */}
                    <div className="mt-4">
                        <CustomPagination
                            currentPage={page}
                            totalPages={data?.meta.totalPages || 0}
                            onPageChange={(newPage) => setPage(newPage)}
                            containerClassName="flex items-center justify-center mt-4 space-x-2"
                            previousButtonClassName="px-3 py-1 bg-transparent text-gray-600 rounded disabled:opacity-50"
                            nextButtonClassName="px-3 py-1 bg-transparent text-gray-600 rounded disabled:opacity-50"
                            activePageClassName="bg-white text-highBlue"
                            inactivePageClassName="bg-transparent text-gray-600"
                            dotClassName="px-3 py-1 text-gray-600"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PlanningRappelComponent;
