import { Input } from "../../../../@/components/ui/input";
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "../../../../@/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../@/components/ui/table";
import {
    Plus,
    Edit,
    Trash2,
    Tag,
    FileText,
    Car,
    X,
    Eye,
} from "lucide-react";
import { CategoriesTabProps } from "./types";
import { textInputStyle, labelStyle, buttonStyle } from "./constants";
import { useState } from "react";
import { fetchCarsByCategory, removeCategoryMapping } from "../../../../services/goalManagementService";
import { useNavigate } from "react-router-dom";
import { state } from "../../../../utils/shared_functions";
import { useToast } from "../../../../hooks/use-toast";


function CategoriesTab({
    showCreateCategoryDialog,
    setShowCreateCategoryDialog,
    newCategory,
    setNewCategory,
    handleCreateCategory,
    goalCategories
}: CategoriesTabProps) {
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [categorySheet, setCategorySheet] = useState(false);
    const [categoryCars, setCategoryCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [carToDelete, setCarToDelete] = useState<{mappingId: number, carModel: string} | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleCategoryClick = async (category: any) => {
        setSelectedCategory(category);
        setCategorySheet(true);
        setLoading(true);
        
        try {
            const cars = await fetchCarsByCategory(state.databaseName, category.CategoryId, navigate);
            setCategoryCars(cars);
        } catch (error) {
            console.error('Error fetching cars:', error);
            toast({
                title: "Erreur",
                description: "Erreur lors du chargement des voitures",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCarFromCategory = (mappingId: number, carModel: string) => {
        setCarToDelete({ mappingId, carModel });
        setShowDeleteConfirmation(true);
    };

    const confirmRemoveCarFromCategory = async () => {
        if (!carToDelete) return;
        
        try {
            await removeCategoryMapping(state.databaseName, carToDelete.mappingId, navigate);
            setCategoryCars(cars => cars.filter(car => car.MappingId !== carToDelete.mappingId));
            toast({
                title: "Succès",
                description: `Voiture ${carToDelete.carModel} retirée de la catégorie`
            });
        } catch (error) {
            console.error('Error removing car:', error);
            toast({
                title: "Erreur",
                description: "Erreur lors du retrait de la voiture",
                variant: "destructive"
            });
        } finally {
            setShowDeleteConfirmation(false);
            setCarToDelete(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Enhanced Header Section */}
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Tag className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-highBlue font-oswald">Gestion des Catégories</h3>
                        <p className="text-sm text-gray-600 font-oswald">Organisez et gérez vos catégories d'objectifs</p>
                    </div>
                </div>
                <Dialog 
                    open={showCreateCategoryDialog} 
                    onOpenChange={(open) => {
                        if (open) {
                            // Reset form when opening
                            setNewCategory({ CategoryName: "", Description: "" });
                        }
                        setShowCreateCategoryDialog(open);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className={`${buttonStyle} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Catégorie
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white rounded-xl border-0 shadow-2xl">
                        <DialogHeader className="pb-4">
                            <DialogTitle className="text-xl font-bold text-highBlue font-oswald flex items-center space-x-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Plus className="w-5 h-5 text-blue-600" />
                                </div>
                                <span>Créer une nouvelle catégorie</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className={`${labelStyle} flex items-center space-x-2`}>
                                    <Tag className="w-4 h-4" />
                                    <span>Nom de la catégorie</span>
                                </Label>
                                <Input
                                    className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}
                                    value={newCategory.CategoryName}
                                    onChange={(e) => setNewCategory({...newCategory, CategoryName: e.target.value})}
                                    placeholder="Ex: i10_i20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={`${labelStyle} flex items-center space-x-2`}>
                                    <FileText className="w-4 h-4" />
                                    <span>Description</span>
                                </Label>
                                <Input
                                    className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}
                                    value={newCategory.Description}
                                    onChange={(e) => setNewCategory({...newCategory, Description: e.target.value})}
                                    placeholder="Description de la catégorie"
                                />
                            </div>
                            <Button 
                                onClick={handleCreateCategory} 
                                className={`${buttonStyle} w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Créer la catégorie
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Enhanced Categories Table */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-highBlue font-oswald mb-2">Liste des catégories</h4>
                    <p className="text-sm text-gray-600 font-oswald">Gérez toutes vos catégories d'objectifs</p>
                </div>
                
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-200 bg-gray-50">
                                <TableHead className="font-bold text-gray-700 py-4 text-center">#</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4 text-center">Nom de la catégorie</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4 text-center">Description</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4 text-center">Statut</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4 text-center">Date de création</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {goalCategories.map((category, index) => (
                                <TableRow 
                                    key={category.CategoryId}
                                    className="border-gray-200 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <TableCell className="text-center py-4">
                                        <span className="font-bold text-gray-700">
                                            {index + 1}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <button 
                                            onClick={() => handleCategoryClick(category)}
                                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer underline decoration-dotted"
                                        >
                                            {category.CategoryName}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className="text-gray-700">
                                            {category.Description || "Aucune description"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            category.IsActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {category.IsActive ? 'Actif' : 'Inactif'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className="text-gray-600">
                                            {new Date(category.CreatedAt).toLocaleDateString('fr-FR')}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <div className="flex justify-center space-x-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="hover:bg-blue-500 hover:text-white border-blue-500 text-blue-500 transition-all duration-200"
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="hover:bg-lightBlue hover:text-white border-lightBlue text-lightBlue transition-all duration-200"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="hover:bg-red-500 hover:text-white border-red-500 text-red-500 transition-all duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                            {goalCategories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-16">
                                        <div className="flex flex-col items-center space-y-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
                                                <Tag className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xl font-bold text-gray-600 font-oswald">Aucune catégorie créée</p>
                                                <p className="text-sm text-gray-500 font-oswald max-w-md">
                                                    Commencez par créer votre première catégorie d'objectifs pour organiser vos goals
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                                                <Plus className="w-4 h-4" />
                                                <span className="text-sm font-medium">Cliquez sur "Nouvelle Catégorie" pour commencer</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Cars Sheet */}
            <Sheet open={categorySheet} onOpenChange={setCategorySheet}>
                <SheetContent className="w-full max-w-4xl sm:max-w-5xl min-w-[1000px]" style={{ width: '1000px', maxWidth: '1200px' }}>
                    <SheetHeader>
                        <SheetTitle className="flex items-center space-x-2">
                            <Car className="w-5 h-5" />
                            <span>Voitures - {selectedCategory?.CategoryName}</span>
                        </SheetTitle>
                        <SheetDescription>
                            Gestion des voitures associées à cette catégorie
                        </SheetDescription>
                    </SheetHeader>
                    
                    <div className="mt-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-600">Chargement...</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-lg">Voitures associées ({categoryCars.length})</h4>
                                </div>
                                
                                {categoryCars.length > 0 ? (
                                    <div className="border rounded-lg">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Modèle</TableHead>
                                                    <TableHead>Marque</TableHead>
                                                    <TableHead>Année</TableHead>
                                                    <TableHead>Prix</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {categoryCars.map((car) => (
                                                    <TableRow key={car.MappingId}>
                                                        <TableCell className="font-medium">{car.carModel}</TableCell>
                                                        <TableCell>{car.carMake}</TableCell>
                                                        <TableCell>{car.carYear}</TableCell>
                                                        <TableCell>{car.carPrice ? (car.carPrice / 1000).toFixed(3) : 'N/A'}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRemoveCarFromCategory(car.MappingId, car.carModel)}
                                                                className="hover:bg-red-50 hover:text-red-600 border-red-200"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">Aucune voiture associée à cette catégorie</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600 font-bold">
                            Confirmer la suppression
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir retirer la voiture "{carToDelete?.carModel}" de cette catégorie ? 
                            Cette action peut être annulée en réassignant la voiture à la catégorie.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            onClick={() => {
                                setShowDeleteConfirmation(false);
                                setCarToDelete(null);
                            }}
                            className="hover:bg-gray-100"
                        >
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmRemoveCarFromCategory}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Confirmer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default CategoriesTab;
