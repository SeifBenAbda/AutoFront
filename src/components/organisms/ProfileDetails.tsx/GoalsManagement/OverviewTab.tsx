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

function OverviewTab({
    filterYear,
    setFilterYear,
    filterMonth,
    setFilterMonth,
    goalCategories,
    monthlyGoals,
    goalStatuses,
    goalStatusViews
}: OverviewTabProps) {
    console.log('OverviewTab render with:', { filterYear, filterMonth, goalCategories, monthlyGoals, goalStatuses, goalStatusViews });
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={cardStyle}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-highGrey font-oswald">Catégories Actives</p>
                            <p className="text-2xl font-bold text-highBlue">
                                {goalCategories.filter(cat => cat.IsActive).length || 0}
                            </p>
                        </div>
                        <Target className="w-8 h-8 text-lightBlue" />
                    </div>
                </div>
                
                <div className={cardStyle}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-highGrey font-oswald">Objectifs du Mois</p>
                            <p className="text-2xl font-bold text-highBlue">{monthlyGoals.length || 0}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-lightBlue" />
                    </div>
                </div>
                
                <div className={cardStyle}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-highGrey font-oswald">Statuts Disponibles</p>
                            <p className="text-2xl font-bold text-highBlue">
                                {goalStatuses.filter(status => status.IsActive).length || 0}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-lightBlue" />
                    </div>
                </div>
            </div>

            {/* Goal Status Summary */}
            <div className={cardStyle}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-highBlue font-oswald">État des Objectifs</h3>
                    <div className="flex items-center space-x-2">
                        <YearSelector
                            value={filterYear}
                            onValueChange={setFilterYear}
                            startYear={2025}
                            endYear={2026}
                            showAllOption={true}
                            allOptionLabel="Toutes les années"
                        />
                        <Select value={filterMonth > 0 ? filterMonth.toString() : "all"} onValueChange={(value) => setFilterMonth(value === "all" ? 0 : parseInt(value))}>
                            <SelectTrigger className="w-36">
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
                
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Objectif</TableHead>
                            <TableHead>Réalisé</TableHead>
                            <TableHead>Manque</TableHead>
                            <TableHead>Pourcentage</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(goalStatusViews.length > 0 && monthlyGoals.length > 0) ? (
                            goalStatusViews.map((view, index) => {
                                const progress = view.Objectif ? Math.min((view.Total / view.Objectif) * 100, 100) : 0;
                                return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{view.CategoryName}</TableCell>
                                    <TableCell>{view.Objectif}</TableCell>
                                    <TableCell>{view.Total}</TableCell>
                                    <TableCell className={view.Manque < 0 ? "text-red-500" : "text-green-500"}>
                                        {view.Manque}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                <div 
                                                    className="bg-lightBlue h-2 rounded-full" 
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            {Math.round(progress)}%
                                        </div>
                                    </TableCell>
                                </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-highGrey py-8">
                                    {monthlyGoals.length === 0 
                                        ? "Aucun objectif défini pour cette période" 
                                        : "Aucune donnée de performance disponible pour cette période"
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default OverviewTab;
