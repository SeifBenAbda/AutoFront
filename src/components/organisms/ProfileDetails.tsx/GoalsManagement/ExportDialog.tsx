import { useState, useEffect } from "react";
import { Button } from "../../../../@/components/ui/button";
import { Label } from "../../../../@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../../@/components/ui/dialog";
import { Checkbox } from "../../../../@/components/ui/checkbox";
import { Card, CardContent } from "../../../../@/components/ui/card";
import { Separator } from "../../../../@/components/ui/separator";
import {
    FileText,
    FileSpreadsheet,
    Download,
    Calendar,
    Filter,
    Settings,
    Loader2,
    CheckCircle2,
    CalendarRange
} from "lucide-react";
import { useExportGoals } from "../../../../hooks/useExport";
import { ExportGoalsOptions } from "../../../../services/exportService";
import YearSelector from "../../../atoms/YearSelector";

interface ExportDialogProps {
    goalCategories: any[];
    filterYear: number;
    filterMonth: number;
}

const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function ExportDialog({ goalCategories, filterYear }: Omit<ExportDialogProps, 'filterMonth'>) {
    const [isOpen, setIsOpen] = useState(false);
    const [exportType, setExportType] = useState<'pdf' | 'excel'>('excel');
    const [selectedYear, setSelectedYear] = useState(filterYear || new Date().getFullYear());
    const [periodType, setPeriodType] = useState<'specific' | 'semester' | 'year'>('year');
    const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [includeDetails, setIncludeDetails] = useState(true);
    const [selectAllCategories, setSelectAllCategories] = useState(true);
    const [selectAllMonths, setSelectAllMonths] = useState(false);

    const exportMutation = useExportGoals();

    // Reset all states when dialog opens - only run when isOpen changes
    useEffect(() => {
        if (isOpen) {
            // Reset all form states to default values
            setExportType('excel');
            setSelectedYear(filterYear || new Date().getFullYear());
            setPeriodType('year');
            setSelectedMonths([]);
            setSelectedCategories([]);
            setIncludeDetails(true);
            setSelectAllCategories(true);
            setSelectAllMonths(false);
            
            // Reset the export mutation state (clear any success/error messages)
            exportMutation.reset();
        }
    }, [isOpen, filterYear]); // Removed exportMutation from dependencies

    const handleMonthToggle = (monthIndex: number) => {
        if (selectedMonths.includes(monthIndex)) {
            setSelectedMonths(selectedMonths.filter(m => m !== monthIndex));
        } else {
            setSelectedMonths([...selectedMonths, monthIndex]);
        }
    };

    const handleCategoryToggle = (categoryName: string) => {
        if (selectedCategories.includes(categoryName)) {
            setSelectedCategories(selectedCategories.filter(c => c !== categoryName));
        } else {
            setSelectedCategories([...selectedCategories, categoryName]);
        }
    };

    const handleSelectAllMonths = (checked: boolean) => {
        setSelectAllMonths(checked);
        if (checked) {
            setSelectedMonths(Array.from({ length: 12 }, (_, i) => i + 1));
        } else {
            setSelectedMonths([]);
        }
    };

    const handleSelectAllCategories = (checked: boolean) => {
        setSelectAllCategories(checked);
        if (checked) {
            setSelectedCategories(goalCategories.filter(cat => cat.IsActive).map(cat => cat.CategoryName));
        } else {
            setSelectedCategories([]);
        }
    };

    const handleExport = async () => {
        try {
            const options: ExportGoalsOptions = {
                exportType,
                year: selectedYear,
                includeDetails,
            };

            // Handle period selection
            if (periodType === 'specific') {
                options.months = selectedMonths;
            } else if (periodType === 'semester') {
                options.months = Array.from({ length: 12 }, (_, i) => i + 1); // All months
                options.groupBySemester = true;
            } else if (periodType === 'year') {
                options.months = Array.from({ length: 12 }, (_, i) => i + 1); // All months
            }

            // Handle categories
            if (!selectAllCategories && selectedCategories.length > 0) {
                options.categories = selectedCategories;
            }

            await exportMutation.mutateAsync(options);
            setIsOpen(false);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const isExportDisabled = () => {
        if (periodType === 'specific' && selectedMonths.length === 0) return true;
        if (!selectAllCategories && selectedCategories.length === 0) return true;
        return false;
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:from-green-100 hover:to-blue-100 text-green-700 hover:text-green-800 font-oswald"
                >
                    <Download className="w-4 h-4" />
                    <span>Exporter Rapport</span>
                </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-3 text-xl font-bold font-oswald text-highBlue">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <span>Exporter Rapport des Objectifs</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Format Selection */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-4">
                                <Settings className="w-5 h-5 text-gray-600" />
                                <h3 className="text-lg font-semibold font-oswald text-gray-900">Format d'Export</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div 
                                    className={`flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                                        exportType === 'excel' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                                    }`}
                                    onClick={() => setExportType('excel')}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 ${
                                        exportType === 'excel' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                                    }`}>
                                        {exportType === 'excel' && <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>}
                                    </div>
                                    <Label className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <div className="p-2 bg-green-100 rounded">
                                            <FileSpreadsheet className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold font-oswald text-gray-900">Excel (.xlsx)</p>
                                            <p className="text-xs text-gray-500">Idéal pour l'analyse de données</p>
                                        </div>
                                    </Label>
                                </div>
                                
                                <div 
                                    className={`flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                                        exportType === 'pdf' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                    onClick={() => setExportType('pdf')}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 ${
                                        exportType === 'pdf' ? 'border-red-500 bg-red-500' : 'border-gray-300'
                                    }`}>
                                        {exportType === 'pdf' && <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>}
                                    </div>
                                    <Label className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <div className="p-2 bg-red-100 rounded">
                                            <FileText className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold font-oswald text-gray-900">PDF</p>
                                            <p className="text-xs text-gray-500">Parfait pour l'impression</p>
                                        </div>
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Period Selection */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-4">
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <h3 className="text-lg font-semibold font-oswald text-gray-900">Période d'Export</h3>
                            </div>

                            <div className="space-y-4">
                                {/* Year Selection */}
                                <div className="flex items-center space-x-4">
                                    <Label className="font-medium text-gray-700 font-oswald">Année:</Label>
                                    <YearSelector
                                        value={selectedYear}
                                        onValueChange={setSelectedYear}
                                        startYear={2020}
                                        endYear={2030}
                                        className="w-32"
                                    />
                                </div>

                                {/* Period Type Selection */}
                                <div className="space-y-3">
                                    <div 
                                        className={`flex items-center space-x-2 p-3 border rounded cursor-pointer ${
                                            periodType === 'year' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                        }`}
                                        onClick={() => setPeriodType('year')}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            periodType === 'year' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                        }`}>
                                            {periodType === 'year' && <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>}
                                        </div>
                                        <Label className="font-oswald cursor-pointer">Année complète (12 mois)</Label>
                                    </div>
                                    
                                    <div 
                                        className={`flex items-center space-x-2 p-3 border rounded cursor-pointer ${
                                            periodType === 'semester' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                        }`}
                                        onClick={() => setPeriodType('semester')}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            periodType === 'semester' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                        }`}>
                                            {periodType === 'semester' && <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>}
                                        </div>
                                        <Label className="font-oswald cursor-pointer">Par semestre (regroupement 6 mois)</Label>
                                    </div>
                                    
                                    <div 
                                        className={`flex items-center space-x-2 p-3 border rounded cursor-pointer ${
                                            periodType === 'specific' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                        }`}
                                        onClick={() => setPeriodType('specific')}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            periodType === 'specific' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                        }`}>
                                            {periodType === 'specific' && <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>}
                                        </div>
                                        <Label className="font-oswald cursor-pointer">Mois spécifiques</Label>
                                    </div>
                                </div>

                                {/* Month Selection (when specific is selected) */}
                                {periodType === 'specific' && (
                                    <div className="pl-6 border-l-2 border-gray-200">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <Checkbox 
                                                id="selectAllMonths"
                                                checked={selectAllMonths}
                                                onCheckedChange={handleSelectAllMonths}
                                            />
                                            <Label htmlFor="selectAllMonths" className="font-medium text-gray-700 font-oswald">
                                                Sélectionner tous les mois
                                            </Label>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2">
                                            {months.map((month, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`month-${index}`}
                                                        checked={selectedMonths.includes(index + 1)}
                                                        onCheckedChange={() => handleMonthToggle(index + 1)}
                                                    />
                                                    <Label 
                                                        htmlFor={`month-${index}`} 
                                                        className="text-sm font-oswald cursor-pointer"
                                                    >
                                                        {month}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Semester explanation */}
                                {periodType === 'semester' && (
                                    <div className="pl-6 border-l-2 border-blue-200 bg-blue-50 p-3 rounded">
                                        <div className="flex items-start space-x-2">
                                            <CalendarRange className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div className="text-sm text-blue-800">
                                                <p className="font-medium font-oswald">Mode semestriel sélectionné:</p>
                                                <p className="font-oswald">• 1er Semestre: Janvier - Juin</p>
                                                <p className="font-oswald">• 2ème Semestre: Juillet - Décembre</p>
                                                <p className="font-oswald">• Totaux calculés automatiquement</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories Selection */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-4">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <h3 className="text-lg font-semibold font-oswald text-gray-900">Catégories d'Objectifs</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Checkbox 
                                        id="selectAllCategories"
                                        checked={selectAllCategories}
                                        onCheckedChange={handleSelectAllCategories}
                                    />
                                    <Label htmlFor="selectAllCategories" className="font-medium text-gray-700 font-oswald">
                                        Toutes les catégories actives
                                    </Label>
                                </div>

                                {!selectAllCategories && (
                                    <div className="pl-6 border-l-2 border-gray-200">
                                        <div className="grid grid-cols-2 gap-2">
                                            {goalCategories.filter(cat => cat.IsActive).map((category) => (
                                                <div key={category.CategoryId} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`category-${category.CategoryId}`}
                                                        checked={selectedCategories.includes(category.CategoryName)}
                                                        onCheckedChange={() => handleCategoryToggle(category.CategoryName)}
                                                    />
                                                    <Label 
                                                        htmlFor={`category-${category.CategoryId}`} 
                                                        className="text-sm font-oswald cursor-pointer"
                                                    >
                                                        {category.CategoryName}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Options */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold font-oswald text-gray-900 mb-4">Options Avancées</h3>
                            
                            <div className="flex items-center space-x-3">
                                <Checkbox 
                                    id="includeDetails"
                                    checked={includeDetails}
                                    onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
                                />
                                <Label htmlFor="includeDetails" className="font-oswald">
                                    Inclure un résumé détaillé avec statistiques
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4">
                        <div className="text-sm text-gray-500 font-oswald">
                            {exportType === 'excel' ? '📊 Format Excel' : '📄 Format PDF'} • 
                            {periodType === 'year' ? ' Année complète' : 
                             periodType === 'semester' ? ' Analyse semestrielle' : 
                             ` ${selectedMonths.length} mois sélectionnés`} •
                            {selectAllCategories ? ' Toutes catégories' : ` ${selectedCategories.length} catégories`}
                        </div>
                        
                        <div className="flex space-x-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsOpen(false)}
                                className="font-oswald"
                            >
                                Annuler
                            </Button>
                            
                            <Button 
                                onClick={handleExport}
                                disabled={isExportDisabled() || exportMutation.isPending}
                                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 font-oswald"
                            >
                                {exportMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Export en cours...
                                    </>
                                ) : exportMutation.isSuccess ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Exporté avec succès!
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 mr-2" />
                                        Exporter Rapport
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ExportDialog;
