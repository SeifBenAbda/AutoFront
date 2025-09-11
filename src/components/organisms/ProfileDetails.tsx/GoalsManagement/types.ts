import {
    CreateGoalCategoryDto,
    CreateGoalStatusDto,
    CreateMonthlyGoalDto,
    GoalCategory,
    GoalStatus,
    MonthlyGoal,
    GoalStatusView
} from "../../../../services/goalManagementService";

// =====================
// Tab Component Props Interfaces
// =====================

export interface OverviewTabProps {
    filterYear: number;
    setFilterYear: (year: number) => void;
    filterMonth: number;
    setFilterMonth: (month: number) => void;
    goalCategories: GoalCategory[];
    monthlyGoals: MonthlyGoal[];
    goalStatuses: GoalStatus[];
    goalStatusViews: GoalStatusView[];
    loading?: boolean;
}

export interface CategoriesTabProps {
    showCreateCategoryDialog: boolean;
    setShowCreateCategoryDialog: (open: boolean) => void;
    newCategory: CreateGoalCategoryDto;
    setNewCategory: React.Dispatch<React.SetStateAction<CreateGoalCategoryDto>>;
    handleCreateCategory: () => Promise<void> | void;
    goalCategories: GoalCategory[];
}

export interface StatusTabProps {
    showCreateStatusDialog: boolean;
    setShowCreateStatusDialog: (open: boolean) => void;
    newStatus: CreateGoalStatusDto;
    setNewStatus: React.Dispatch<React.SetStateAction<CreateGoalStatusDto>>;
    handleCreateStatus: () => Promise<void> | void;
    handleDeleteStatus: (id: number, statusName: string) => Promise<void> | void;
    handleRestoreStatus: (id: number, statusName: string) => Promise<void> | void;
    goalStatuses: GoalStatus[];
}

export interface GoalsTabProps {
    showCreateGoalDialog: boolean;
    setShowCreateGoalDialog: (open: boolean) => void;
    newGoal: CreateMonthlyGoalDto;
    setNewGoal: React.Dispatch<React.SetStateAction<CreateMonthlyGoalDto>>;
    handleCreateGoal: () => Promise<void> | void;
    goalCategories: GoalCategory[];
    goalStatuses: GoalStatus[];
    monthlyGoals: MonthlyGoal[];
}

export interface MappingsTabProps {
    goalCategories: GoalCategory[];
    goalStatuses: GoalStatus[];
}

// =====================
// Re-export main types for convenience
// =====================
export type {
    CreateGoalCategoryDto,
    CreateGoalStatusDto,
    CreateMonthlyGoalDto,
    GoalCategory,
    GoalStatus,
    MonthlyGoal,
    GoalStatusView
};
