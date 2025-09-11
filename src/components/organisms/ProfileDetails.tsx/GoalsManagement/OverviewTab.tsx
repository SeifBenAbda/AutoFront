import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../@/components/ui/table";
import {
    Target,
    Calendar,
    CheckCircle,
} from "lucide-react";
import { OverviewTabProps } from "./types";
import { cardStyle, months } from "./constants";
import YearSelector from "../../../atoms/YearSelector";

// Helper function to convert English month names to French
const convertMonthToFrench = (englishMonth: string): string => {
    const monthMap: { [key: string]: string } = {
        'January': 'Janvier',
        'February': 'Février', 
        'March': 'Mars',
        'April': 'Avril',
        'May': 'Mai',
        'June': 'Juin',
        'July': 'Juillet',
        'August': 'Août',
        'September': 'Septembre',
        'October': 'Octobre',
        'November': 'Novembre',
        'December': 'Décembre'
    };
    
    return monthMap[englishMonth] || englishMonth;
};

// Helper function to get status badge styling
const getStatusBadgeStyle = (statusName: string) => {
    const statusStyles: { [key: string]: string } = {
        'Facturé': 'bg-green-100 text-green-800 border-green-200',
        'Livré': 'bg-blue-100 text-blue-800 border-blue-200', 
        'Réservé': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'En Cours': 'bg-orange-100 text-orange-800 border-orange-200',
        'HDSI': 'bg-purple-100 text-purple-800 border-purple-200',
        'Annulé': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return statusStyles[statusName] || 'bg-gray-100 text-gray-800 border-gray-200';
};

function OverviewTab({
    filterYear,
    setFilterYear,
    filterMonth,
    setFilterMonth,
    goalCategories,
    monthlyGoals,
    goalStatuses,
    goalStatusViews,
    loading = false
}: OverviewTabProps) {
    
    // Filter monthly goals to only count those with active statuses
    const activeMonthlyGoals = monthlyGoals.filter(goal => {
        const status = goalStatuses.find(s => s.StatusId === goal.StatusId);
        return status?.IsActive === true;
    });
    
    // Filter goalStatusViews based on selected year and month filters
    const filteredGoalStatusViews = goalStatusViews.filter(view => {
        const yearMatch = filterYear === 0 || view.Year === filterYear;
        const monthMatch = filterMonth === 0 || view.Month === filterMonth;
        return yearMatch && monthMatch;
    });
    
    // Helper function to get progress color based on percentage
    const getProgressColor = (progress: number) => {
        if (progress >= 100) return 'bg-green-500'; // Excellent - Green
        if (progress >= 75) return 'bg-blue-500';   // Good - Blue
        if (progress >= 50) return 'bg-yellow-500'; // Fair - Yellow
        if (progress >= 25) return 'bg-orange-500'; // Poor - Orange
        return 'bg-red-500'; // Very poor - Red
    };
    
    // Helper function to get progress text color
    const getProgressTextColor = (progress: number) => {
        if (progress >= 100) return 'text-green-700';
        if (progress >= 75) return 'text-blue-700';
        if (progress >= 50) return 'text-yellow-700';
        if (progress >= 25) return 'text-orange-700';
        return 'text-red-700';
    };
    
    // Helper function to get status badge color
    const getStatusBadgeColor = (manque: number) => {
        if (manque < 0) return 'bg-red-100 text-red-800 border-red-200'; // Negative = Behind goal
        if (manque === 0) return 'bg-blue-100 text-blue-800 border-blue-200'; // Zero = Perfect
        return 'bg-green-100 text-green-800 border-green-200'; // Positive = Exceeded goal
    };
    
    return (
        <div className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Catégories Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 font-semibold font-oswald mb-1">Catégories Actives</p>
                            <p className="text-3xl font-bold text-purple-800 font-oswald">
                                {goalCategories.filter(cat => cat.IsActive).length || 0}
                            </p>
                            <p className="text-xs text-purple-500 mt-1">Types d'objectifs</p>
                        </div>
                        <div className="bg-purple-500 p-3 rounded-full">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
                
                {/* Objectifs du Mois Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-semibold font-oswald mb-1">Objectifs du Mois</p>
                            <p className="text-3xl font-bold text-blue-800 font-oswald">{activeMonthlyGoals.length || 0}</p>
                            <p className="text-xs text-blue-500 mt-1">Objectifs actifs définis</p>
                        </div>
                        <div className="bg-blue-500 p-3 rounded-full">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Statuts Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-semibold font-oswald mb-1">Statuts Disponibles</p>
                            <p className="text-3xl font-bold text-green-800 font-oswald">
                                {goalStatuses.filter(status => status.IsActive).length || 0}
                            </p>
                            <p className="text-xs text-green-500 mt-1">États de suivi</p>
                        </div>
                        <div className="bg-green-500 p-3 rounded-full">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Goal Status Summary */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 font-oswald">État des Objectifs</h3>
                        <p className="text-sm text-gray-500 mt-1">Suivi de la performance par catégorie</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <YearSelector
                            value={filterYear}
                            onValueChange={setFilterYear}
                            startYear={2025}
                            endYear={2026}
                            showAllOption={true}
                            allOptionLabel="Toutes les années"
                            className="w-40"
                        />
                        <Select value={filterMonth > 0 ? filterMonth.toString() : "all"} onValueChange={(value) => setFilterMonth(value === "all" ? 0 : parseInt(value))}>
                            <SelectTrigger className="w-40 border-gray-300 focus:border-blue-500 focus:ring-blue-200">
                                <SelectValue placeholder="Mois" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les mois</SelectItem>
                                {months.map((month, index) => (
                                    <SelectItem key={index + 1} value={(index + 1).toString()}>{month}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-200 bg-gray-50">
                                <TableHead className="font-bold text-gray-700 py-4">Catégorie</TableHead>
                                <TableHead className="font-bold text-gray-700 text-center">Année</TableHead>
                                <TableHead className="font-bold text-gray-700 text-center">Mois</TableHead>
                                <TableHead className="font-bold text-gray-700 text-center">Statut</TableHead>
                                <TableHead className="font-bold text-gray-700 text-center">Objectif</TableHead>
                                <TableHead className="font-bold text-gray-700 text-center">Réalisé</TableHead>
                                <TableHead className="font-bold text-gray-700 text-center">Manque</TableHead>
                                <TableHead className="font-bold text-gray-700 text-center">Performance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12">
                                        <div className="space-y-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                            <div className="text-gray-600 font-medium">
                                                Chargement des données...
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                Veuillez patienter pendant que nous récupérons vos objectifs
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (filteredGoalStatusViews.length > 0 && activeMonthlyGoals.length > 0) ? (
                                filteredGoalStatusViews.map((view, index) => {
                                    const progress = view.Objectif ? Math.min((view.Total / view.Objectif) * 100, 100) : 0;
                                    const progressColor = getProgressColor(progress);
                                    const progressTextColor = getProgressTextColor(progress);
                                    const badgeColor = getStatusBadgeColor(view.Manque);
                                    
                                    return (
                                    <TableRow key={index} className="border-gray-200 hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-semibold text-gray-900 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-md mr-3 ${progressColor}`}></div>
                                                {view.CategoryName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md font-bold">
                                                {view.Year}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                                                {convertMonthToFrench(view.MonthName)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadgeStyle(view.StatusName)}`}>
                                                {view.StatusName}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md font-bold">
                                                {view.Objectif}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-bold">
                                                {view.Total}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`px-3 py-1 rounded-md font-bold border ${badgeColor}`}>
                                                {view.Manque < 0 ? view.Manque : `+${view.Manque}`}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="space-y-2 px-2">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm font-bold ${progressTextColor}`}>
                                                        {Math.round(progress)}%
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {progress >= 100 ? '🏆 Atteint' : progress >= 75 ? '👍 Bon' : progress >= 50 ? '⚡ Moyen' : '🔥 Effort'}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-md h-3 shadow-inner">
                                                    <div 
                                                        className={`h-3 rounded-md transition-all duration-500 ease-out ${progressColor} shadow-sm`}
                                                        style={{ width: `${progress}%` }}
                                                    >
                                                        <div className="h-full w-full bg-gradient-to-r from-transparent to-white opacity-30 rounded-md"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12">
                                        <div className="space-y-3">
                                            <div className="text-gray-400 text-6xl">📊</div>
                                            <div className="text-gray-600 font-medium">
                                                {activeMonthlyGoals.length === 0 
                                                    ? "Aucun objectif actif défini pour cette période" 
                                                    : filteredGoalStatusViews.length === 0
                                                    ? "Aucune donnée de performance disponible pour les filtres sélectionnés"
                                                    : "Aucune donnée de performance disponible pour cette période"
                                                }
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                Créez des objectifs ou modifiez les filtres pour voir les données
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default OverviewTab;
