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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../../../@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../@/components/ui/table";
import { useToast } from "../../../../hooks/use-toast";
import { useBulkAssignCarsToCategory, useRemoveCategoryMapping } from "../../../../hooks/useGoalsManagement";
import { fetchCarCategorization } from "../../../../services/goalManagementService";
import CarsMultiSelect from "../../../atoms/CarsMultiSelect";
import CategorySelect from "./CategorySelect";

import Loading from "../../../atoms/Loading";
import { state } from "../../../../utils/shared_functions";
import { MappingsTabProps } from "./types";
import { buttonStyle, labelStyle } from "./constants";
import { Plus, MapPin, Trash2, Filter, RotateCcw } from "lucide-react";

function MappingsTab({ goalCategories }: MappingsTabProps) {
    const { toast } = useToast();
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [selectedCarsFilter, setSelectedCarsFilter] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Bulk assignment states
    const [showBulkAssignDialog, setShowBulkAssignDialog] = useState(false);
    const [selectedCarNames, setSelectedCarNames] = useState<string[]>([]);
    const [assignCategoryName, setAssignCategoryName] = useState<string>("");
    
    // Delete confirmation
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        mappingId: number | null;
        carInfo: string;
    }>({
        isOpen: false,
        mappingId: null,
        carInfo: ""
    });

    // Hooks
    const bulkAssignMutation = useBulkAssignCarsToCategory();
    const removeMutation = useRemoveCategoryMapping();

    const loadData = async () => {
        try {
            setLoading(true);
            // Fetch all data first, then filter on frontend for car names
            const rows = await fetchCarCategorization(state.databaseName, categoryFilter || undefined, undefined, undefined, () => {});
            
            // Filter by selected car names on frontend if any are selected
            let filteredRows = rows || [];
            if (selectedCarsFilter.length > 0) {
                filteredRows = filteredRows.filter((row: any) => {
                    const carName = row.CarName || row.carName || row.Model || row.Modele || row.carModel || '';
                    return selectedCarsFilter.includes(carName);
                });
            }
            
            setData(filteredRows);
        } catch (e: any) {
            toast({ title: "Erreur", description: e.message || 'Chargement échoué', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleBulkAssign = async () => {
        if (selectedCarNames.length === 0 || !assignCategoryName) {
            toast({ title: 'Champs manquants', description: 'Veuillez sélectionner au moins une voiture et une catégorie', variant: 'destructive' });
            return;
        }
        
        try {
            const result = await bulkAssignMutation.mutateAsync({
                carNames: selectedCarNames,
                categoryName: assignCategoryName
            });
            
            const successMsg = result.message || 'Voitures assignées avec succès';
            const errorMsg = (result.errors && result.errors.length > 0) ? ` (${result.errors.length} erreurs)` : '';
            
            toast({ 
                title: 'Assignation terminée', 
                description: successMsg + errorMsg,
                variant: (result.errors && result.errors.length > 0) ? 'destructive' : 'default'
            });
            
            setSelectedCarNames([]);
            setAssignCategoryName("");
            setShowBulkAssignDialog(false);
            loadData();
        } catch (e: any) {
            toast({ title: 'Erreur', description: e.message || 'Assignation échouée', variant: 'destructive' });
        }
    };

    const handleDeleteMapping = (mappingId: number, carName: string, categoryName: string) => {
        setDeleteConfirmation({
            isOpen: true,
            mappingId,
            carInfo: `${carName} de la catégorie ${categoryName}`
        });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmation.mappingId) return;
        
        try {
            await removeMutation.mutateAsync({ mappingId: deleteConfirmation.mappingId });
            toast({ title: "Succès", description: "Mapping supprimé avec succès" });
            setDeleteConfirmation({
                isOpen: false,
                mappingId: null,
                carInfo: ""
            });
            loadData();
        } catch (error: any) {
            toast({ 
                title: "Erreur", 
                description: error.message || "Erreur lors de la suppression",
                variant: "destructive" 
            });
        }
    };

    const resetFilters = () => {
        setCategoryFilter("");
        setSelectedCarsFilter([]);
        loadData();
    };

    // Initial load when tab opened
    useEffect(() => { loadData(); }, []);

    // Reload data when filters change
    useEffect(() => { loadData(); }, [categoryFilter, selectedCarsFilter]);

    return (
        <div className="space-y-8">
            {/* Enhanced Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-highBlue font-oswald">Mappings Voiture-Catégorie</h3>
                        <p className="text-sm text-gray-600 font-oswald">Gérez l'assignation des voitures aux catégories</p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <Dialog open={showBulkAssignDialog} onOpenChange={setShowBulkAssignDialog}>
                        <DialogTrigger asChild>
                            <Button className={`${buttonStyle} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap`}>
                                <Plus className="w-4 h-4 mr-2" />
                                Assigner en lot
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white rounded-xl border-0 shadow-2xl max-h-[80vh] flex flex-col overflow-visible">
                            <DialogHeader className="pb-4 flex-shrink-0">
                                <DialogTitle className="text-xl text-highBlue font-oswald flex items-center space-x-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Plus className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span>Assignation en lot</span>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 flex-1 min-h-0">
                                <div className="space-y-2">
                                    <Label className={`${labelStyle} flex items-center space-x-2 font-oswald`}>
                                        <span>Voitures</span>
                                    </Label>
                                    <div className="relative z-10">
                                        <CarsMultiSelect
                                            selectedValues={selectedCarNames}
                                            onChange={setSelectedCarNames}
                                            isFiltering={false}
                                            inDialog={true}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className={`${labelStyle} flex items-center space-x-2 font-oswald`}>
                                        <span>Catégorie</span>
                                    </Label>
                                    <CategorySelect
                                        value={assignCategoryName}
                                        onChange={setAssignCategoryName}
                                        categories={goalCategories}
                                        placeholder="Sélectionner une catégorie"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowBulkAssignDialog(false)}
                                    className="font-oswald hover:bg-gray-100"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleBulkAssign}
                                    className={`${buttonStyle} font-oswald shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                                    disabled={bulkAssignMutation.isPending || selectedCarNames.length === 0 || !assignCategoryName}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {bulkAssignMutation.isPending ? "Assignment..." : "Assigner"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                            <Label className="text-sm font-medium text-gray-700 font-oswald whitespace-nowrap">Catégorie:</Label>
                            <div className="min-w-[150px]">
                                <CategorySelect
                                    value={categoryFilter}
                                    onChange={setCategoryFilter}
                                    categories={goalCategories}
                                    placeholder="Toutes les catégories"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Label className="text-sm font-medium text-gray-700 font-oswald whitespace-nowrap">Voitures:</Label>
                            <div className="min-w-[200px]">
                                <CarsMultiSelect
                                    selectedValues={selectedCarsFilter}
                                    onChange={setSelectedCarsFilter}
                                    isFiltering={true}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex space-x-2">
                        <Button 
                            onClick={loadData} 
                            className={`${buttonStyle} font-oswald`}
                            disabled={loading}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            {loading ? 'Chargement...' : 'Filtrer'}
                        </Button>
                        <Button 
                            onClick={resetFilters} 
                            variant="outline"
                            className="font-oswald hover:bg-gray-100"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Réinitialiser
                        </Button>
                    </div>
                </div>
            </div>

            {/* Enhanced Mappings Table */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-highBlue font-oswald mb-2">Liste des mappings</h4>
                            <p className="text-sm text-gray-600 font-oswald">Gérez les assignations des voitures aux catégories</p>
                        </div>
                        {data && (
                            <div className="text-sm text-gray-500 font-oswald">
                                <span className="font-medium text-blue-600">{data.length}</span> mapping{data.length !== 1 ? 's' : ''} trouvé{data.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-200 bg-gray-50">
                                <TableHead className="text-gray-700 py-4 font-oswald">ID Voiture</TableHead>
                                <TableHead className="text-gray-700 font-oswald">Nom de la voiture</TableHead>
                                <TableHead className="text-gray-700 font-oswald">Catégorie</TableHead>
                                <TableHead className="text-gray-700 font-oswald">Statut</TableHead>
                                <TableHead className="text-gray-700 text-center font-oswald">Disponible</TableHead>
                                <TableHead className="text-gray-700 text-center font-oswald">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((row: any, idx: number) => {
                                    // Normalize fields coming from vw_CarCategorization
                                    const carId = row.CarId ?? row.carId;
                                    const carName = row.CarName || row.carName || row.Model || row.Modele || row.carModel || '-';
                                    const category = row.CategoryName || row.categoryName || '-';
                                    const status = row.StatusName || row.statusName || '-';
                                    const availableRaw = row.Available ?? row.available ?? row.isAvailable;
                                    const mappingId = row.MappingId;
                                    
                                    let availableDisplay = '-';
                                    if (availableRaw === true || availableRaw === 1) availableDisplay = 'Oui';
                                    else if (availableRaw === false || availableRaw === 0) availableDisplay = 'Non';
                                    
                                    return (
                                        <TableRow key={idx} className="border-gray-200 hover:bg-gray-50 transition-colors">
                                            <TableCell className="py-4 font-oswald">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium font-oswald">
                                                    #{carId ?? '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell className=" text-gray-900 py-4 font-oswald">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-md mr-3 bg-blue-500"></div>
                                                    {carName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-700 font-oswald">
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium font-oswald">
                                                    {category}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-700 font-oswald">
                                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium font-oswald">
                                                    {status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center font-oswald">
                                                <span className={`px-3 py-1 rounded-md text-xs font-medium font-oswald ${
                                                    availableDisplay === 'Oui' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : availableDisplay === 'Non'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {availableDisplay}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {mappingId && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteMapping(mappingId, carName, category)}
                                                        className="h-8 w-8 p-0 border-red-300 text-red-600 hover:border-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 font-oswald">
                                        {loading ? (
                                            <Loading />
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="text-gray-400 text-6xl">🗺️</div>
                                                <div className="text-gray-600 font-medium font-oswald">
                                                    Aucun mapping trouvé
                                                </div>
                                                <div className="text-gray-400 text-sm font-oswald">
                                                    Utilisez "Assigner en lot" pour créer de nouveaux mappings
                                                </div>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => 
                setDeleteConfirmation({...deleteConfirmation, isOpen: open})
            }>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-oswald">Supprimer le Mapping</AlertDialogTitle>
                        <AlertDialogDescription className="font-oswald">
                            Êtes-vous sûr de vouloir supprimer le mapping de {deleteConfirmation.carInfo} ?
                            <br /><br />
                            <span className="text-red-600 font-medium">
                                Cette action retirera la voiture de la catégorie.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="font-oswald">Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmDelete}
                            className="bg-red-500 hover:bg-red-600 font-oswald"
                            disabled={removeMutation.isPending}
                        >
                            {removeMutation.isPending ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default MappingsTab;
