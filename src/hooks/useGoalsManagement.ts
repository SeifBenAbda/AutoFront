import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { state } from '../utils/shared_functions';
import {
    fetchGoalCategories,
    fetchAllGoalStatuses,
    fetchMonthlyGoals,
    fetchGoalStatusViews,
    fetchCarsByCategory,
    createGoalCategory,
    createGoalStatus,
    createMonthlyGoal,
    deleteGoalStatus,
    restoreGoalStatus,
    removeCategoryMapping,
    assignCarToCategory,
    autoCategorizeCars,
    CreateGoalCategoryDto,
    CreateGoalStatusDto,
    CreateMonthlyGoalDto,
} from '../services/goalManagementService';

// Simple hook that fetches all goals data at once - similar to useAgentsHistory
const useGoalsData = (year: number, month: number, category?: string) => {
    const navigate = useNavigate();
    
    // Create a filter key to ensure cache invalidation when filters change
    const filterKey = `${year}-${month}-${category || 'all'}`;
    
    // Debug logging
    console.log('🎯 useGoalsData called with:', { 
        databaseName: state.databaseName, 
        year, 
        month, 
        category,
        filterKey,
        isDatabaseNameValid: !!state.databaseName 
    });
    
    const categoriesQuery = useQuery({
        queryKey: ['goalCategories', state.databaseName],
        queryFn: () => {
            return fetchGoalCategories(state.databaseName, navigate);
        },
        staleTime: 10 * 60 * 1000, // 10 minutes for categories (less frequently changing)
        gcTime: 30 * 60 * 1000, // 30 minutes in cache
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        enabled: !!state.databaseName,
    });

    const statusesQuery = useQuery({
        queryKey: ['goalStatuses', state.databaseName],
        queryFn: () => {
            return fetchAllGoalStatuses(state.databaseName, navigate);
        },
        staleTime: 10 * 60 * 1000, // 10 minutes for statuses (less frequently changing)
        gcTime: 30 * 60 * 1000, // 30 minutes in cache
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        enabled: !!state.databaseName,
    });

    const monthlyGoalsQuery = useQuery({
        queryKey: ['monthlyGoals', state.databaseName, filterKey],
        queryFn: () => fetchMonthlyGoals(state.databaseName, year === 0 ? undefined : year, month === 0 ? undefined : month, navigate),
        staleTime: 2 * 60 * 1000, // 2 minutes - shorter cache for filtered data
        gcTime: 5 * 60 * 1000, // 5 minutes - clean up old cache faster
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        enabled: !!state.databaseName, // Always enabled when database is available
    });

    const statusViewsQuery = useQuery({
        queryKey: ['goalStatusViews', state.databaseName, filterKey],
        queryFn: () => fetchGoalStatusViews(state.databaseName, year === 0 ? undefined : year, month === 0 ? undefined : month, category, navigate),
        staleTime: 2 * 60 * 1000, // 2 minutes - shorter cache for filtered data
        gcTime: 5 * 60 * 1000, // 5 minutes - clean up old cache faster
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        enabled: !!state.databaseName, // Always enabled when database is available
    });

    const result = {
        data: {
            goalCategories: categoriesQuery.data || [],
            goalStatuses: statusesQuery.data || [],
            monthlyGoals: monthlyGoalsQuery.data || [],
            goalStatusViews: statusViewsQuery.data || [],
        },
        isLoading: categoriesQuery.isLoading || statusesQuery.isLoading || monthlyGoalsQuery.isLoading || statusViewsQuery.isLoading,
        isError: categoriesQuery.isError || statusesQuery.isError || monthlyGoalsQuery.isError || statusViewsQuery.isError,
        error: categoriesQuery.error || statusesQuery.error || monthlyGoalsQuery.error || statusViewsQuery.error,
        refetch: () => {
            categoriesQuery.refetch();
            statusesQuery.refetch();
            monthlyGoalsQuery.refetch();
            statusViewsQuery.refetch();
        }
    };

    // Debug the results
    console.log('📊 useGoalsData result:', {
        monthlyGoalsQuery: {
            data: monthlyGoalsQuery.data,
            isLoading: monthlyGoalsQuery.isLoading,
            isError: monthlyGoalsQuery.isError,
            error: monthlyGoalsQuery.error
        },
        monthlyGoalsCount: monthlyGoalsQuery.data?.length || 0,
        result: result.data
    });

    return result;
};

// Mutation hooks for create operations - no auto-invalidation
export const useCreateGoalCategory = () => {
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: (data: CreateGoalCategoryDto) =>
            createGoalCategory(state.databaseName, data, navigate),
        // Removed onSuccess auto-invalidation - user must manually refresh
    });
};

export const useCreateGoalStatus = () => {
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: (data: CreateGoalStatusDto) =>
            createGoalStatus(state.databaseName, data, navigate),
        // Removed onSuccess auto-invalidation - user must manually refresh
    });
};

export const useCreateMonthlyGoal = () => {
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: (data: CreateMonthlyGoalDto) =>
            createMonthlyGoal(state.databaseName, data, navigate),
        // Removed onSuccess auto-invalidation - user must manually refresh
    });
};

export const useDeleteGoalStatus = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({ id }: { id: number }) =>
            deleteGoalStatus(state.databaseName, id, navigate),
    });
};

export const useRestoreGoalStatus = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({ id }: { id: number }) =>
            restoreGoalStatus(state.databaseName, id, navigate),
    });
};

export const useRemoveCategoryMapping = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({ mappingId }: { mappingId: number }) =>
            removeCategoryMapping(state.databaseName, mappingId, navigate),
    });
};

// Car mapping mutations
export const useAssignCarToCategory = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({ carId, categoryName, statusName }: { carId: number; categoryName: string; statusName?: string }) =>
            assignCarToCategory(state.databaseName, carId, categoryName, navigate, statusName),
    });
};

export const useAutoCategorizeCars = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: () => autoCategorizeCars(state.databaseName, navigate),
    });
};

export default useGoalsData;
