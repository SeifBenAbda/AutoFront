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
    Loader,
} from "lucide-react";
import { CategoriesTabProps } from "./types";
import { textInputStyle, labelStyle, buttonStyle } from "./constants";
import { useState } from "react";
import { fetchCarsByCategory, removeCategoryMapping, updateGoalCategory, deleteGoalCategory, restoreGoalCategory } from "../../../../services/goalManagementService";
import { useNavigate } from "react-router-dom";
import { state } from "../../../../utils/shared_functions";
import { useToast } from "../../../../hooks/use-toast";
import React from "react";

// Data model
interface GoalCategory {
    CategoryId: number;
    CategoryName: string;
    Description: string;
    IsActive: boolean;
    CreatedAt: string;
}

// Edit Category Dialog Component
const EditCategoryDialog = ({
    category,
    isOpen,
    onClose,
    onSave
}: {
    category: GoalCategory | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedCategory: GoalCategory) => void;
}) => {
    const [formData, setFormData] = useState<Partial<GoalCategory>>({});
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (category) {
            setFormData({
                CategoryId: category.CategoryId,
                CategoryName: category.CategoryName,
                Description: category.Description
            });
            setSuccessMsg('');
            setErrorMsg('');
        }
    }, [category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        setIsLoading(true);

        if (!category || !formData.CategoryName?.trim()) {
            setErrorMsg("Le nom de la catégorie est requis.");
            setIsLoading(false);
            return;
        }

        try {
            await updateGoalCategory(
                state.databaseName,
                category.CategoryId,
                {
                    CategoryName: formData.CategoryName,
                    Description: formData.Description || ''
                },
                navigate
            );

            setSuccessMsg('Catégorie modifiée avec succès.');
            setTimeout(() => {
                setSuccessMsg('');
                setIsLoading(false);
                onClose();
                if (category) {
                    onSave({ ...category, ...formData as GoalCategory });
                }
            }, 1200);
        } catch (error) {
            console.error('Error updating category:', error);
            setErrorMsg("Une erreur est survenue lors de la modification.");
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-xl border-0 shadow-2xl">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-bold text-highBlue font-oswald flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Edit className="w-5 h-5 text-blue-600" />
                        </div>
                        <span>Modifier la catégorie</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isLoading && (
                        <div className="flex justify-center items-center my-10">
                            <Loader className="h-8 w-8 animate-spin text-highBlue" />
                        </div>
                    )}
                    
                    {!isLoading && (
                        <>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className={`${labelStyle} flex items-center space-x-2`}>
                                        <Tag className="w-4 h-4" />
                                        <span>Nom de la catégorie</span>
                                    </Label>
                                    <Input
                                        id="CategoryName"
                                        name="CategoryName"
                                        value={formData.CategoryName || ''}
                                        onChange={handleChange}
                                        className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}
                                        placeholder="Ex: i10_i20"
                                        required
                                        onFocus={(e) => {
                                            const len = e.target.value.length;
                                            e.target.setSelectionRange(len, len);
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className={`${labelStyle} flex items-center space-x-2`}>
                                        <FileText className="w-4 h-4" />
                                        <span>Description</span>
                                    </Label>
                                    <Input
                                        id="Description"
                                        name="Description"
                                        value={formData.Description || ''}
                                        onChange={handleChange}
                                        className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}
                                        placeholder="Description de la catégorie"
                                        onFocus={(e) => {
                                            const len = e.target.value.length;
                                            e.target.setSelectionRange(len, len);
                                        }}
                                    />
                                </div>
                            </div>

                            {successMsg && (
                                <div className="bg-green-50 border border-green-300 text-green-800 rounded-md p-3 text-sm mt-2">
                                    {successMsg}
                                </div>
                            )}
                            {errorMsg && (
                                <div className="bg-red-50 border border-red-300 text-red-800 rounded-md p-3 text-sm mt-2">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="font-oswald hover:bg-gray-100"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className={`${buttonStyle} font-oswald shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Mettre à jour
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};


function CategoriesTab({
    showCreateCategoryDialog,
    setShowCreateCategoryDialog,
    newCategory,
    setNewCategory,
    handleCreateCategory,
    goalCategories,
    refetch
}: CategoriesTabProps) {
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [categorySheet, setCategorySheet] = useState(false);
    const [categoryCars, setCategoryCars] = useState<any[]>([]);
    const [carsLoading, setCarsLoading] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [carToDelete, setCarToDelete] = useState<{mappingId: number, carModel: string} | null>(null);
    
    // Edit category states
    const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState<GoalCategory | null>(null);
    
    // Delete category states
    const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Individual loading states for different operations
    const [tableLoading, setTableLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    
    const navigate = useNavigate();
    const { toast } = useToast();

    // Handle refetch with loading state
    const handleRefetch = async () => {
        setTableLoading(true);
        try {
            await refetch();
        } finally {
            setTableLoading(false);
        }
    };

    // Handle create category with loading state
    const handleCreateCategoryWithLoading = async () => {
        setCreateLoading(true);
        try {
            await handleCreateCategory();
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCategoryClick = async (category: any) => {
        setSelectedCategory(category);
        setCategorySheet(true);
        setCarsLoading(true);
        
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
            setCarsLoading(false);
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

    // Handle edit category
    const handleEditCategory = (category: GoalCategory) => {
        setEditingCategory(category);
        setShowEditCategoryDialog(true);
    };

    const handleSaveCategory = () => {
        setShowEditCategoryDialog(false);
        setEditingCategory(null);
        handleRefetch(); // Use individual loading refetch
    };

    const handleCloseEditDialog = () => {
        setShowEditCategoryDialog(false);
        setEditingCategory(null);
    };

    // Handle delete category
    const handleDeleteCategory = (category: any) => {
        setCategoryToDelete(category);
        setShowDeleteCategoryDialog(true);
    };

    const handleConfirmDeleteCategory = async (permanent: boolean = false) => {
        if (!categoryToDelete) return;
        
        setIsDeleting(true);
        
        try {
            if (permanent) {
                // For now, we only support soft delete
                // Permanent delete would require a different backend endpoint
                await deleteGoalCategory(state.databaseName, categoryToDelete.CategoryId, navigate);
                toast({
                    title: "Succès",
                    description: "Catégorie désactivée avec succès"
                });
            } else {
                await deleteGoalCategory(state.databaseName, categoryToDelete.CategoryId, navigate);
                toast({
                    title: "Succès",
                    description: "Catégorie désactivée avec succès"
                });
            }
            
            setShowDeleteCategoryDialog(false);
            setCategoryToDelete(null);
            // Refresh the categories data with individual loading
            handleRefetch();
        } catch (error) {
            console.error('Error deleting category:', error);
            toast({
                title: "Erreur",
                description: "Erreur lors de la suppression de la catégorie",
                variant: "destructive"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRestoreCategory = async (categoryId: number) => {
        try {
            await restoreGoalCategory(state.databaseName, categoryId, navigate);
            toast({
                title: "Succès",
                description: "Catégorie restaurée avec succès"
            });
            // Refresh the categories data with individual loading
            handleRefetch();
        } catch (error) {
            console.error('Error restoring category:', error);
            toast({
                title: "Erreur",
                description: "Erreur lors de la restauration de la catégorie",
                variant: "destructive"
            });
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
                        {createLoading ? (
                            <div className="flex justify-center items-center my-10">
                                <Loader className="h-8 w-8 animate-spin text-highBlue" />
                            </div>
                        ) : (
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
                                    onClick={handleCreateCategoryWithLoading} 
                                    className={`${buttonStyle} w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                                    disabled={createLoading}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Créer la catégorie
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Enhanced Categories Table */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                {tableLoading ? (
                    <div className="flex justify-center items-center my-10">
                        <Loader className="h-8 w-8 animate-spin text-highBlue" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-200 bg-gray-50">
                                <TableHead className="text-gray-700 py-4 text-center font-oswald">#</TableHead>
                                <TableHead className="text-gray-700 py-4 text-center font-oswald">Nom de la catégorie</TableHead>
                                <TableHead className="text-gray-700 py-4 text-center font-oswald">Description</TableHead>
                                <TableHead className="text-gray-700 py-4 text-center font-oswald">Statut</TableHead>
                                <TableHead className="text-gray-700 py-4 text-center font-oswald">Date de création</TableHead>
                                <TableHead className="text-gray-700 py-4 text-center font-oswald">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {goalCategories.map((category, index) => (
                                <TableRow 
                                    key={category.CategoryId}
                                    className="border-gray-200 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <TableCell className="text-center py-4">
                                        <span className="text-gray-700 font-oswald">
                                            {index + 1}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <button 
                                            onClick={() => handleCategoryClick(category)}
                                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer underline decoration-dotted font-oswald"
                                        >
                                            {category.CategoryName}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className="text-gray-700 font-oswald">
                                            {category.Description || "Aucune description"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className={`px-3 py-1 rounded-md text-sm font-medium font-oswald ${
                                            category.IsActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {category.IsActive ? 'Actif' : 'Inactif'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className="text-gray-600 font-oswald">
                                            {new Date(category.CreatedAt).toLocaleDateString('fr-FR')}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <div className="flex justify-center space-x-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="hover:bg-blue-500 hover:text-white border-blue-500 text-blue-500 transition-all duration-200 font-oswald"
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="hover:bg-black hover:text-white border-black text-black transition-all duration-200 font-oswald"
                                                onClick={() => handleEditCategory(category)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="hover:bg-red-500 hover:text-white border-red-500 text-red-500 transition-all duration-200 font-oswald"
                                                onClick={() => handleDeleteCategory(category)}
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
                )}
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
                        {carsLoading ? (
                            <div className="flex justify-center items-center my-10">
                                <Loader className="h-8 w-8 animate-spin text-highBlue" />
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

            {/* Edit Dialog */}
            <EditCategoryDialog
                category={editingCategory}
                isOpen={showEditCategoryDialog}
                onClose={handleCloseEditDialog}
                onSave={handleSaveCategory}
            />

            {/* Delete Category Dialog */}
            <AlertDialog open={showDeleteCategoryDialog} onOpenChange={setShowDeleteCategoryDialog}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600 font-bold">
                            Supprimer la catégorie
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Que souhaitez-vous faire avec la catégorie "{categoryToDelete?.CategoryName}" ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    {isDeleting ? (
                        <div className="flex justify-center items-center my-10">
                            <Loader className="h-8 w-8 animate-spin text-highBlue" />
                        </div>
                    ) : (
                        <AlertDialogFooter className="flex-col space-y-3">
                            <div className="flex space-x-3 w-full">
                                <AlertDialogCancel 
                                    onClick={() => {
                                        setShowDeleteCategoryDialog(false);
                                        setCategoryToDelete(null);
                                    }}
                                    className="hover:bg-gray-100 flex-1"
                                >
                                    Annuler
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleConfirmDeleteCategory(false)}
                                    className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Désactiver
                                </AlertDialogAction>
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                                La désactivation masque la catégorie mais garde les données
                            </div>
                        </AlertDialogFooter>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default CategoriesTab;
