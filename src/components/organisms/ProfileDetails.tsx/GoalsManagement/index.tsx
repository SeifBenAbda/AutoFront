import { useState } from "react";
import { useUser } from "../../../../context/userContext";
import { useToast } from "../../../../hooks/use-toast";
import { Button } from "../../../../@/components/ui/button";
import {
    Target,
    Calendar,
    BarChart3,
    TrendingUp,
    Car,
    CheckCircle,
    AlertCircle,
    RefreshCw
} from "lucide-react";
import Loading from "../../../atoms/Loading";

import useGoalsData, {
    useCreateGoalCategory,
    useCreateGoalStatus,
    useCreateMonthlyGoal
} from "../../../../hooks/useGoalsManagement";
import {
    CreateGoalCategoryDto,
    CreateGoalStatusDto,
    CreateMonthlyGoalDto
} from "../../../../services/goalManagementService";

import OverviewTab from "./OverviewTab";
import CategoriesTab from "./CategoriesTab";
import StatusTab from "./StatusTab";
import GoalsTab from "./GoalsTab";
import MappingsTab from "./MappingsTab";
import { cardStyle } from "./constants";

export default function GoalsManagement() {
    const { user } = useUser();
    const { toast } = useToast();
    
    // State for different tabs and filters - set current year/month as defaults
    const [activeTab, setActiveTab] = useState(0);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear()); // Default to current year
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1); // Default to current month
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
        statusName: "", // Add statusName field
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
        if (!newGoal.categoryName || !newGoal.statusName || !newGoal.year || !newGoal.month || !newGoal.targetQuantity) {
            toast({
                title: "Champs manquants",
                description: "Veuillez remplir tous les champs requis",
                variant: "destructive"
            });
            return;
        }
        
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
                statusName: "",
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
                        goalStatuses={goalStatuses}
                        monthlyGoals={monthlyGoals}
                    />
                );
            case 4: return <MappingsTab goalCategories={goalCategories} goalStatuses={goalStatuses} />;
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
