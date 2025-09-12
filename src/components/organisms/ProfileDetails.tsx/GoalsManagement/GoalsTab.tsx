import { useState } from "react";
import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import { Label } from "../../../../@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../@/components/ui/select";
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
import {
    Plus,
    Edit,
    Trash2,
    Target,
} from "lucide-react";
import { GoalsTabProps } from "./types";
import { textInputStyle, labelStyle, buttonStyle, months } from "./constants";
import { useUpdateMonthlyGoal, useUpdateMonthlyGoalById, useDeleteMonthlyGoal } from "../../../../hooks/useGoalsManagement";

function GoalsTab({
    showCreateGoalDialog,
    setShowCreateGoalDialog,
    newGoal,
    setNewGoal,
    handleCreateGoal,
    goalCategories,
    goalStatuses,
    monthlyGoals,
    refetch
}: GoalsTabProps) { 
    // Filter state
    const [filterMonth, setFilterMonth] = useState<number>(0); // 0 means all months
    
    // Edit goal states
    const [showEditGoalDialog, setShowEditGoalDialog] = useState(false);
    const [editingGoal, setEditingGoal] = useState<any | null>(null);
    const [editFormData, setEditFormData] = useState({
        categoryName: "",
        statusName: "",
        year: 0,
        month: 0,
        targetQuantity: 0,
        createdBy: ""
    });
    
    // Delete goal states
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        goalId: number | null;
        goalInfo: string;
    }>({
        isOpen: false,
        goalId: null,
        goalInfo: ""
    });
    
    // Hooks
    const updateMutation = useUpdateMonthlyGoal();
    const updateByIdMutation = useUpdateMonthlyGoalById();
    const deleteMutation = useDeleteMonthlyGoal();

    // Filter goals based on selected month
    const filteredGoals = filterMonth === 0 
        ? monthlyGoals 
        : monthlyGoals?.filter(goal => goal.Month === filterMonth);
        
    // Handle edit goal
    const handleEditGoal = (goal: any) => {
        setEditingGoal(goal);
        setEditFormData({
            categoryName: goalCategories.find(cat => cat.CategoryId === goal.CategoryId)?.CategoryName || "",
            statusName: goalStatuses.find(status => status.StatusId === goal.StatusId)?.StatusName || "",
            year: goal.Year,
            month: goal.Month,
            targetQuantity: goal.TargetQuantity,
            createdBy: goal.CreatedBy || ""
        });
        setShowEditGoalDialog(true);
    };
    
    const handleSaveGoal = async () => {
        if (!editingGoal) return;
        
        try {
            // Use the new proper update endpoint that handles updates by goal ID
            const updateData = {
                categoryName: editFormData.categoryName,
                statusName: editFormData.statusName,
                targetQuantity: editFormData.targetQuantity,
                updatedBy: editFormData.createdBy // The backend expects 'updatedBy' field
            };
            
            await updateByIdMutation.mutateAsync({
                id: editingGoal.GoalId,
                data: updateData
            });
            
            setShowEditGoalDialog(false);
            setEditingGoal(null);
            refetch(); // Refetch data to get updated goals
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };
    
    const handleDeleteClick = (goal: any) => {
        const categoryName = goalCategories.find(cat => cat.CategoryId === goal.CategoryId)?.CategoryName || "Unknown";
        setDeleteConfirmation({
            isOpen: true,
            goalId: goal.GoalId,
            goalInfo: `${categoryName} - ${months[goal.Month - 1]} ${goal.Year} (Objectif: ${goal.TargetQuantity})`
        });
    };
    
    const handleConfirmDelete = async () => {
        if (!deleteConfirmation.goalId) return;
        
        try {
            await deleteMutation.mutateAsync({ id: deleteConfirmation.goalId });
            setDeleteConfirmation({
                isOpen: false,
                goalId: null,
                goalInfo: ""
            });
            refetch(); // Refetch data to get updated goals list
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Enhanced Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-highBlue font-oswald">Gestion des Objectifs</h3>
                        <p className="text-sm text-gray-600 font-oswald">Définissez et suivez vos objectifs mensuels</p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* Month Filter */}
                    <div className="flex items-center space-x-2">
                        <Label className="text-sm font-medium text-gray-700 font-oswald whitespace-nowrap">Filtrer par mois:</Label>
                        <Select value={filterMonth > 0 ? filterMonth.toString() : "all"} onValueChange={(value) => setFilterMonth(value === "all" ? 0 : parseInt(value))}>
                            <SelectTrigger className="w-40 border-gray-300 focus:border-blue-500 focus:ring-blue-200 font-oswald">
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
                    
                    {/* Create Goal Dialog */}
                    <Dialog 
                        open={showCreateGoalDialog} 
                        onOpenChange={(open) => {
                            if (open) {
                                setNewGoal({ categoryName: "", statusName: "", year: 0, month: 0, targetQuantity: 0, createdBy: "" });
                            }
                            setShowCreateGoalDialog(open);
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className={`${buttonStyle} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap`}>
                                <Plus className="w-4 h-4 mr-2" />
                                Nouvel Objectif
                            </Button>
                        </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white rounded-xl border-0 shadow-2xl">
                        <DialogHeader className="pb-4">
                            <DialogTitle className="text-xl font-bold text-highBlue font-oswald flex items-center space-x-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Target className="w-5 h-5 text-blue-600" />
                                </div>
                                <span>Créer un nouvel objectif</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className={`${labelStyle} flex items-center space-x-2 font-oswald`}>
                                    <span>Catégorie</span>
                                </Label>
                                <Select 
                                    value={newGoal.categoryName} 
                                    onValueChange={(value) => setNewGoal({...newGoal, categoryName: value})}
                                >
                                    <SelectTrigger className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}>
                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {goalCategories.filter(cat => cat.IsActive).map((category) => (
                                            <SelectItem key={category.CategoryId} value={category.CategoryName}>
                                                {category.CategoryName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className={`${labelStyle} flex items-center space-x-2 font-oswald`}>
                                    <span>Statut cible</span>
                                </Label>
                                <Select 
                                    value={newGoal.statusName} 
                                    onValueChange={(value) => setNewGoal({...newGoal, statusName: value})}
                                >
                                    <SelectTrigger className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}>
                                        <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {goalStatuses.filter(status => status.IsActive).map((status) => (
                                            <SelectItem key={status.StatusId} value={status.StatusName}>
                                                {status.StatusName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className={`${labelStyle} font-oswald`}>Année</Label>
                                    <Input
                                        type="number"
                                        className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}
                                        value={newGoal.year === 0 ? "" : newGoal.year}
                                        onChange={(e) => setNewGoal({...newGoal, year: e.target.value === "" ? 0 : parseInt(e.target.value)})}
                                        placeholder="Année"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className={`${labelStyle} font-oswald`}>Mois</Label>
                                    <Select 
                                        value={newGoal.month === 0 ? "" : newGoal.month.toString()} 
                                        onValueChange={(value) => setNewGoal({...newGoal, month: value === "" ? 0 : parseInt(value)})}
                                    >
                                        <SelectTrigger className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}>
                                            <SelectValue placeholder="Mois" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((month, index) => (
                                                <SelectItem key={index + 1} value={(index + 1).toString()}>
                                                    {month}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className={`${labelStyle} font-oswald`}>Quantité cible</Label>
                                <Input
                                    type="number"
                                    className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}
                                    value={newGoal.targetQuantity === 0 ? "" : newGoal.targetQuantity}
                                    onChange={(e) => setNewGoal({...newGoal, targetQuantity: e.target.value === "" ? 0 : parseInt(e.target.value)})}
                                    placeholder="Quantité"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreateGoalDialog(false)}
                                    className="font-oswald hover:bg-gray-100"
                                >
                                    Annuler
                                </Button>
                                <Button 
                                    onClick={handleCreateGoal} 
                                    className={`${buttonStyle} font-oswald shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Créer
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                </div>
            </div>

            {/* Enhanced Goals Table */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-highBlue font-oswald mb-2">Liste des objectifs</h4>
                            <p className="text-sm text-gray-600 font-oswald">Gérez tous vos objectifs mensuels</p>
                        </div>
                        {filteredGoals && monthlyGoals && (
                            <div className="text-sm text-gray-500 font-oswald">
                                {filterMonth > 0 ? (
                                    <span>
                                        <span className="font-medium text-blue-600">{filteredGoals.length}</span> objectif{filteredGoals.length !== 1 ? 's' : ''} 
                                        {' '}pour <span className="font-medium text-blue-600">{months[filterMonth - 1]}</span>
                                        {' '}sur {monthlyGoals.length} total{monthlyGoals.length !== 1 ? 'aux' : ''}
                                    </span>
                                ) : (
                                    <span><span className="font-medium text-blue-600">{filteredGoals.length}</span> objectif{filteredGoals.length !== 1 ? 's' : ''} au total</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-200 bg-gray-50">
                                <TableHead className="text-gray-700 py-4 font-oswald">ID</TableHead>
                                <TableHead className="text-gray-700 font-oswald">Catégorie</TableHead>
                                <TableHead className="text-gray-700 text-center font-oswald">Statut</TableHead>
                                <TableHead className="text-gray-700 text-center font-oswald">Année</TableHead>
                                <TableHead className="text-gray-700 text-center font-oswald">Mois</TableHead>
                                <TableHead className="text-gray-700 text-center font-oswald">Objectif</TableHead>
                                <TableHead className="text-gray-700 font-oswald">Créé par</TableHead>
                                <TableHead className="text-center text-gray-700 font-oswald">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredGoals && filteredGoals.length > 0 ? (
                                filteredGoals.map((goal) => {
                                    return (
                                        <TableRow key={goal.GoalId} className="border-gray-200 hover:bg-gray-50 transition-colors">
                                            <TableCell className="py-4 font-oswald">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium font-oswald">
                                                    #{goal.GoalId}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-semibold text-gray-900 py-4 font-oswald">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-md mr-3 bg-blue-500"></div>
                                                    {goalCategories.find(cat => cat.CategoryId === goal.CategoryId)?.CategoryName || 'Unknown Category'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-oswald">
                                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-medium font-oswald">
                                                    {goalStatuses.find(status => status.StatusId === goal.StatusId)?.StatusName || 'Unknown Status'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center font-oswald">
                                                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md font-oswald">
                                                    {goal.Year}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center font-oswald">
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium font-oswald">
                                                    {months[goal.Month - 1] || goal.Month}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center font-oswald">
                                                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-md font-bold font-oswald">
                                                    {goal.TargetQuantity}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-700 font-oswald">{goal.CreatedBy}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditGoal(goal)}
                                                        className="h-8 w-8 p-0 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(goal)}
                                                        className="h-8 w-8 p-0 border-red-300 text-red-600 hover:border-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 font-oswald">
                                        <div className="space-y-3">
                                            <div className="text-gray-400 text-6xl">🎯</div>
                                            <div className="text-gray-600 font-medium font-oswald">
                                                {monthlyGoals === undefined ? 
                                                    'Chargement des objectifs...' : 
                                                    filteredGoals && filteredGoals.length === 0 && monthlyGoals.length > 0 ?
                                                    `Aucun objectif trouvé pour ${filterMonth > 0 ? months[filterMonth - 1] : 'cette période'}` :
                                                    'Aucun objectif trouvé'
                                                }
                                            </div>
                                            <div className="text-gray-400 text-sm font-oswald">
                                                {monthlyGoals === undefined ? 
                                                    'Veuillez patienter...' : 
                                                    filteredGoals && filteredGoals.length === 0 && monthlyGoals.length > 0 ?
                                                    'Essayez de changer le filtre ou créez un nouvel objectif pour ce mois' :
                                                    'Créez votre premier objectif en cliquant sur "Nouvel Objectif"'
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit Goal Dialog */}
            <Dialog open={showEditGoalDialog} onOpenChange={setShowEditGoalDialog}>
                <DialogContent className="sm:max-w-md bg-white rounded-xl border-0 shadow-2xl">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-xl text-highBlue font-oswald flex items-center space-x-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Edit className="w-5 h-5 text-blue-600" />
                            </div>
                            <span>Modifier l'objectif</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        {/* Display current goal info as readonly */}
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-sm font-semibold text-gray-600 font-oswald">Catégorie</Label>
                                    <div className="text-gray-900 font-medium font-oswald">{editFormData.categoryName}</div>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold text-gray-600 font-oswald">Statut</Label>
                                    <Select
                                        value={editFormData.statusName}
                                        onValueChange={(value) => setEditFormData({
                                            ...editFormData,
                                            statusName: value
                                        })}
                                    >
                                        <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900 font-oswald">
                                            <SelectValue placeholder="Sélectionner un statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {goalStatuses.map(status => (
                                                <SelectItem key={status.StatusId} value={status.StatusName}>
                                                    <div className="flex items-center">
                                                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                            {status.StatusKey}
                                                        </span>
                                                        {status.StatusName}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold text-gray-600 font-oswald">Année</Label>
                                    <div className="text-gray-900 font-medium font-oswald">{editFormData.year}</div>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold text-gray-600 font-oswald">Mois</Label>
                                    <div className="text-gray-900 font-medium font-oswald">{months[editFormData.month - 1] || ""}</div>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-sm font-semibold text-gray-600 font-oswald">Créé par</Label>
                                    <div className="text-gray-900 font-medium font-oswald">{editFormData.createdBy}</div>
                                </div>
                            </div>
                        </div>

                        {/* Editable target quantity field */}
                        <div className="space-y-2">
                            <Label className={`${labelStyle} flex items-center space-x-2`}>
                                <Target className="w-4 h-4" />
                                <span>Quantité Cible</span>
                            </Label>
                            <Input
                                type="number"
                                value={editFormData.targetQuantity}
                                onChange={(e) => setEditFormData({
                                    ...editFormData,
                                    targetQuantity: parseInt(e.target.value) || 0
                                })}
                                className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}
                                placeholder="Entrez la nouvelle quantité cible"
                                onFocus={(e) => {
                                    const len = e.target.value.length;
                                    e.target.setSelectionRange(len, len);
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEditGoalDialog(false)}
                            className="font-oswald hover:bg-gray-100"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSaveGoal}
                            className={`${buttonStyle} font-oswald shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                            disabled={updateMutation.isPending}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            {updateMutation.isPending ? "Modification..." : "Mettre à jour"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => 
                setDeleteConfirmation({...deleteConfirmation, isOpen: open})
            }>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-oswald">Supprimer l'Objectif</AlertDialogTitle>
                        <AlertDialogDescription className="font-oswald">
                            Êtes-vous sûr de vouloir supprimer cet objectif ?
                            <br />
                            <span className="font-medium text-gray-700">
                                {deleteConfirmation.goalInfo}
                            </span>
                            <br /><br />
                            <span className="text-red-600 font-medium">
                                Cette action est irréversible et supprimera définitivement l'objectif.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="font-oswald">Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmDelete}
                            className="bg-red-500 hover:bg-red-600 font-oswald"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default GoalsTab;
