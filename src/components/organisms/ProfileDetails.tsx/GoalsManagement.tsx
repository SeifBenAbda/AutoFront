import { useState } from "react";
import { useUser } from "../../../context/userContext";
import { useToast } from "../../../hooks/use-toast";
import { Input } from "../../../@/components/ui/input";
import { Button } from "../../../@/components/ui/button";
import { Label } from "../../../@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../@/components/ui/table";
import {
    Target,
    Plus,
    Edit,
    Trash2,
    Calendar,
    BarChart3,
    TrendingUp,
    Car,
    CheckCircle,
    AlertCircle,
    RefreshCw
} from "lucide-react";
import Loading from "../../atoms/Loading";

import useGoalsData, {
    useCreateGoalCategory,
    useCreateGoalStatus,
    useCreateMonthlyGoal
} from "../../../hooks/useGoalsManagement";
import {
    CreateGoalCategoryDto,
    CreateGoalStatusDto,
    CreateMonthlyGoalDto,
    GoalCategory,
    GoalStatus,
    MonthlyGoal,
    GoalStatusView
} from "../../../services/goalManagementService";
import StatusDevisDropDown from "../../../components/atoms/StatusDevis";

// =====================
// Types / Interfaces
// =====================
interface OverviewTabProps {
    filterYear: number;
    setFilterYear: (year: number) => void;
    filterMonth: number;
    setFilterMonth: (month: number) => void;
    goalCategories: GoalCategory[];
    monthlyGoals: MonthlyGoal[];
    goalStatuses: GoalStatus[];
    goalStatusViews: GoalStatusView[];
}

interface CategoriesTabProps {
    showCreateCategoryDialog: boolean;
    setShowCreateCategoryDialog: (open: boolean) => void;
    newCategory: CreateGoalCategoryDto;
    setNewCategory: React.Dispatch<React.SetStateAction<CreateGoalCategoryDto>>;
    handleCreateCategory: () => Promise<void> | void;
    goalCategories: GoalCategory[];
}

interface StatusTabProps {
    showCreateStatusDialog: boolean;
    setShowCreateStatusDialog: (open: boolean) => void;
    newStatus: CreateGoalStatusDto;
    setNewStatus: React.Dispatch<React.SetStateAction<CreateGoalStatusDto>>;
    handleCreateStatus: () => Promise<void> | void;
    goalStatuses: GoalStatus[];
}

interface GoalsTabProps {
    showCreateGoalDialog: boolean;
    setShowCreateGoalDialog: (open: boolean) => void;
    newGoal: CreateMonthlyGoalDto;
    setNewGoal: React.Dispatch<React.SetStateAction<CreateMonthlyGoalDto>>;
    handleCreateGoal: () => Promise<void> | void;
    goalCategories: GoalCategory[];
    monthlyGoals: MonthlyGoal[];
}

// Styling constants (moved outside for sharing)
const textInputStyle = "bg-normalGrey text-highGrey pl-4 p-2 h-10 border border-normalGrey rounded-md font-oswald";
const labelStyle = "block text-sm text-highBlue font-oswald mb-1";
// Primary action button style (updated to improve visibility)
const buttonStyle = "bg-highBlue hover:bg-lightBlue text-white font-oswald px-4 py-2 rounded-md transition-colors";
const cardStyle = "bg-white p-6 rounded-xl border border-normalGrey/20 shadow-sm hover:shadow-md transition-all duration-300";

// Months constant
const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

// Overview Tab Component (extracted and receives props)
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
                        <Select value={filterYear > 0 ? filterYear.toString() : "all"} onValueChange={(value) => setFilterYear(value === "all" ? 0 : parseInt(value))}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Année" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les années</SelectItem>
                                {[2023, 2024, 2025, 2026].map(year => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                        {filterYear > 0 && filterMonth > 0 ? (
                            goalStatusViews.length > 0 ? (
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
                                        Aucun objectif trouvé pour cette période
                                    </TableCell>
                                </TableRow>
                            )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-highGrey py-8">
                                    Veuillez sélectionner une année et un mois pour voir les objectifs
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Categories Tab Component (extracted and receives props)
function CategoriesTab({
    showCreateCategoryDialog,
    setShowCreateCategoryDialog,
    newCategory,
    setNewCategory,
    handleCreateCategory,
    goalCategories
}: CategoriesTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-highBlue font-oswald">Gestion des Catégories</h3>
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
                        <Button className={buttonStyle}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Catégorie
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label className={labelStyle}>Nom de la catégorie</Label>
                                <Input
                                    className={textInputStyle}
                                    value={newCategory.CategoryName}
                                    onChange={(e) => setNewCategory({...newCategory, CategoryName: e.target.value})}
                                    placeholder="Ex: i10_i20"
                                />
                            </div>
                            <div>
                                <Label className={labelStyle}>Description</Label>
                                <Input
                                    className={textInputStyle}
                                    value={newCategory.Description}
                                    onChange={(e) => setNewCategory({...newCategory, Description: e.target.value})}
                                    placeholder="Description de la catégorie"
                                />
                            </div>
                            <Button onClick={handleCreateCategory} className={buttonStyle}>
                                Créer
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className={cardStyle}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date de création</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goalCategories.map((category) => (
                            <TableRow key={category.CategoryId}>
                                <TableCell>{category.CategoryId}</TableCell>
                                <TableCell className="font-medium">{category.CategoryName}</TableCell>
                                <TableCell>{category.Description}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        category.IsActive 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {category.IsActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </TableCell>
                                <TableCell>{new Date(category.CreatedAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" className="hover:bg-lightBlue hover:text-white border-lightBlue text-lightBlue">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="hover:bg-red-500 hover:text-white border-red-500 text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Status Tab Component (extracted and receives props)
function StatusTab({
    showCreateStatusDialog,
    setShowCreateStatusDialog,
    newStatus,
    setNewStatus,
    handleCreateStatus,
    goalStatuses
}: StatusTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-highBlue font-oswald">Gestion des Statuts</h3>
                <Dialog 
                    open={showCreateStatusDialog} 
                    onOpenChange={(open) => {
                        if (open) {
                            setNewStatus({ StatusName: "", Description: "", StatusKey: "" });
                        }
                        setShowCreateStatusDialog(open);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className={buttonStyle}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau Statut
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer un nouveau statut</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label className={labelStyle}>Statut</Label>
                                <StatusDevisDropDown 
                                    value={newStatus.StatusName}
                                    isFiltring={false}
                                    onChange={(val: string) => {
                                        if (val === 'Tous Status') return; // ignore meta option
                                        setNewStatus({
                                            ...newStatus,
                                            StatusName: val,
                                            StatusKey: val
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <Label className={labelStyle}>Description (optionnel)</Label>
                                <Input
                                    className={textInputStyle}
                                    value={newStatus.Description || ''}
                                    onChange={(e) => setNewStatus({...newStatus, Description: e.target.value})}
                                    placeholder="Description du statut"
                                />
                            </div>
                            <Button onClick={handleCreateStatus} className={buttonStyle}>
                                Créer
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className={cardStyle}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Clé</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goalStatuses.map((status) => (
                            <TableRow key={status.StatusId}>
                                <TableCell>{status.StatusId}</TableCell>
                                <TableCell className="font-medium">{status.StatusName}</TableCell>
                                <TableCell>
                                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                        {status.StatusKey}
                                    </code>
                                </TableCell>
                                <TableCell>{status.Description}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        status.IsActive 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {status.IsActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" className="hover:bg-lightBlue hover:text-white border-lightBlue text-lightBlue">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="hover:bg-red-500 hover:text-white border-red-500 text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Goals Tab Component (extracted and receives props)
function GoalsTab({
    showCreateGoalDialog,
    setShowCreateGoalDialog,
    newGoal,
    setNewGoal,
    handleCreateGoal,
    goalCategories,
    monthlyGoals
}: GoalsTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-highBlue font-oswald">Gestion des Objectifs</h3>
                <Dialog 
                    open={showCreateGoalDialog} 
                    onOpenChange={(open) => {
                        if (open) {
                            setNewGoal({ categoryName: "", year: 0, month: 0, targetQuantity: 0, createdBy: "" });
                        }
                        setShowCreateGoalDialog(open);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className={buttonStyle}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvel Objectif
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer un nouvel objectif</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label className={labelStyle}>Catégorie</Label>
                                <Select 
                                    value={newGoal.categoryName} 
                                    onValueChange={(value) => setNewGoal({...newGoal, categoryName: value})}
                                >
                                    <SelectTrigger className={textInputStyle}>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className={labelStyle}>Année</Label>
                                    <Input
                                        type="number"
                                        className={textInputStyle}
                                        value={newGoal.year === 0 ? "" : newGoal.year}
                                        onChange={(e) => setNewGoal({...newGoal, year: e.target.value === "" ? 0 : parseInt(e.target.value)})}
                                        placeholder="Année"
                                    />
                                </div>
                                <div>
                                    <Label className={labelStyle}>Mois</Label>
                                    <Select 
                                        value={newGoal.month === 0 ? "" : newGoal.month.toString()} 
                                        onValueChange={(value) => setNewGoal({...newGoal, month: value === "" ? 0 : parseInt(value)})}
                                    >
                                        <SelectTrigger className={textInputStyle}>
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
                            <div>
                                <Label className={labelStyle}>Quantité cible</Label>
                                <Input
                                    type="number"
                                    className={textInputStyle}
                                    value={newGoal.targetQuantity === 0 ? "" : newGoal.targetQuantity}
                                    onChange={(e) => setNewGoal({...newGoal, targetQuantity: e.target.value === "" ? 0 : parseInt(e.target.value)})}
                                    placeholder="Quantité"
                                />
                            </div>
                            <Button onClick={handleCreateGoal} className={buttonStyle}>
                                Créer
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className={cardStyle}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Année</TableHead>
                            <TableHead>Mois</TableHead>
                            <TableHead>Objectif</TableHead>
                            <TableHead>Créé par</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {monthlyGoals.map((goal) => (
                            <TableRow key={goal.GoalId}>
                                <TableCell>{goal.GoalId}</TableCell>
                                <TableCell>
                                    {goalCategories.find(cat => cat.CategoryId === goal.CategoryId)?.CategoryName}
                                </TableCell>
                                <TableCell>{goal.Year}</TableCell>
                                <TableCell>{months[goal.Month - 1]}</TableCell>
                                <TableCell className="font-medium">{goal.TargetQuantity}</TableCell>
                                <TableCell>{goal.CreatedBy}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" className="hover:bg-lightBlue hover:text-white border-lightBlue text-lightBlue">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="hover:bg-red-500 hover:text-white border-red-500 text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Mappings Tab Component (extracted)
function MappingsTab() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-highBlue font-oswald">Mappings Voiture-Catégorie</h3>
                <Button className={buttonStyle}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Mapping
                </Button>
            </div>
            <div className={cardStyle}>
                <p className="text-highGrey font-oswald">
                    Cette fonctionnalité sera implémentée pour gérer l'association des voitures aux catégories d'objectifs.
                </p>
            </div>
        </div>
    );
}

export default function GoalsManagement() {
    const { user } = useUser();
    const { toast } = useToast();
    
    // State for different tabs and filters - no default filters
    const [activeTab, setActiveTab] = useState(0);
    const [filterYear, setFilterYear] = useState(0); // 0 means no filter
    const [filterMonth, setFilterMonth] = useState(0); // 0 means no filter
    const [filterCategory] = useState("");
    
    // Dialog states
    const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false);
    const [showCreateStatusDialog, setShowCreateStatusDialog] = useState(false);
    const [showCreateGoalDialog, setShowCreateGoalDialog] = useState(false);
    
    // Form states
    const [newCategory, setNewCategory] = useState<CreateGoalCategoryDto>({ 
        CategoryName: "", 
        Description: "" 
    });
    const [newStatus, setNewStatus] = useState<CreateGoalStatusDto>({ 
        StatusName: "", 
        Description: "", 
        StatusKey: "" 
    });
    const [newGoal, setNewGoal] = useState<CreateMonthlyGoalDto>({ 
        categoryName: "",
        year: new Date().getFullYear(), 
        month: new Date().getMonth() + 1, 
        targetQuantity: 0,
        createdBy: ""
    });

    // Hooks for data fetching - simplified like AgentsHistory
    const { data: response, isLoading, refetch } = useGoalsData(filterYear, filterMonth, filterCategory);
    
    const goalCategories = response?.goalCategories || [];
    const goalStatuses = response?.goalStatuses || [];
    const monthlyGoals = response?.monthlyGoals || [];
    const goalStatusViews = response?.goalStatusViews || [];
    
    const refetchAll = () => {
        refetch();
    };
    
    // Mutation hooks
    const createCategoryMutation = useCreateGoalCategory();
    const createStatusMutation = useCreateGoalStatus();
    const createGoalMutation = useCreateMonthlyGoal();

    const tabs = [
        { name: "Vue d'ensemble", icon: BarChart3 },
        { name: "Catégories", icon: Target },
        { name: "Statuts", icon: CheckCircle },
        { name: "Objectifs", icon: Calendar },
        { name: "Mappings", icon: Car }
    ];

    // Handle form submissions
    const handleCreateCategory = async () => {
        try {
            await createCategoryMutation.mutateAsync(newCategory);
            toast({
                title: "Succès",
                description: "Catégorie créée avec succès"
            });
            setNewCategory({ CategoryName: "", Description: "" });
            setShowCreateCategoryDialog(false);
            refetchAll();
        } catch (error) {
            console.error('Error creating goal category:', error);
            toast({
                title: "Erreur",
                description: "Erreur lors de la création de la catégorie",
                variant: "destructive"
            });
        }
    };

    const handleCreateStatus = async () => {
        try {
            await createStatusMutation.mutateAsync(newStatus);
            toast({
                title: "Succès",
                description: "Statut créé avec succès"
            });
            setNewStatus({ StatusName: "", Description: "", StatusKey: "" });
            setShowCreateStatusDialog(false);
            refetchAll();
        } catch (error) {
            console.error('Error creating goal status:', error);
            toast({
                title: "Erreur",
                description: "Erreur lors de la création du statut",
                variant: "destructive"
            });
        }
    };

    const handleCreateGoal = async () => {
        try {
            const goalData = {
                ...newGoal,
                createdBy: user?.username || "Unknown"
            };
            await createGoalMutation.mutateAsync(goalData);
            toast({
                title: "Succès",
                description: "Objectif créé avec succès"
            });
            setNewGoal({ 
                categoryName: "",
                year: new Date().getFullYear(), 
                month: new Date().getMonth() + 1, 
                targetQuantity: 0,
                createdBy: ""
            });
            setShowCreateGoalDialog(false);
            refetchAll();
        } catch (error) {
            console.error('Error creating monthly goal:', error);
            toast({
                title: "Erreur",
                description: "Erreur lors de la création de l'objectif",
                variant: "destructive"
            });
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 0: 
                return (
                    <OverviewTab 
                        filterYear={filterYear}
                        setFilterYear={setFilterYear}
                        filterMonth={filterMonth}
                        setFilterMonth={setFilterMonth}
                        goalCategories={goalCategories}
                        monthlyGoals={monthlyGoals}
                        goalStatuses={goalStatuses}
                        goalStatusViews={goalStatusViews}
                    />
                );
            case 1: 
                return (
                    <CategoriesTab 
                        showCreateCategoryDialog={showCreateCategoryDialog}
                        setShowCreateCategoryDialog={setShowCreateCategoryDialog}
                        newCategory={newCategory}
                        setNewCategory={setNewCategory}
                        handleCreateCategory={handleCreateCategory}
                        goalCategories={goalCategories}
                    />
                );
            case 2: 
                return (
                    <StatusTab 
                        showCreateStatusDialog={showCreateStatusDialog}
                        setShowCreateStatusDialog={setShowCreateStatusDialog}
                        newStatus={newStatus}
                        setNewStatus={setNewStatus}
                        handleCreateStatus={handleCreateStatus}
                        goalStatuses={goalStatuses}
                    />
                );
            case 3: 
                return (
                    <GoalsTab 
                        showCreateGoalDialog={showCreateGoalDialog}
                        setShowCreateGoalDialog={setShowCreateGoalDialog}
                        newGoal={newGoal}
                        setNewGoal={setNewGoal}
                        handleCreateGoal={handleCreateGoal}
                        goalCategories={goalCategories}
                        monthlyGoals={monthlyGoals}
                    />
                );
            case 4: return <MappingsTab />;
            default: return (
                <OverviewTab 
                    filterYear={filterYear}
                    setFilterYear={setFilterYear}
                    filterMonth={filterMonth}
                    setFilterMonth={setFilterMonth}
                    goalCategories={goalCategories}
                    monthlyGoals={monthlyGoals}
                    goalStatuses={goalStatuses}
                    goalStatusViews={goalStatusViews}
                />
            );
        }
    };

    if (user?.role !== 'ADMIN') {
        return (
            <div className={cardStyle}>
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-highBlue mb-2">Accès Restreint</h3>
                    <p className="text-highGrey">Cette fonctionnalité est réservée aux administrateurs.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-lightBlue" />
                    <h2 className="text-2xl font-bold text-highBlue font-oswald">Gestion des Objectifs</h2>
                </div>
                <Button 
                    onClick={refetchAll} 
                    variant="outline"
                    className="font-oswald hover:bg-lightBlue hover:text-white border-lightBlue text-lightBlue"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {tabs.map((tab, index) => {
                    const IconComponent = tab.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-oswald transition-all ${
                                activeTab === index
                                    ? 'bg-highBlue text-white shadow-sm'
                                    : 'text-highGrey hover:text-lightBlue hover:bg-white'
                            }`}
                        >
                            <IconComponent className="w-4 h-4" />
                            <span>{tab.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loading />
                </div>
            ) : (
                renderTabContent()
            )}
        </div>
    );
}