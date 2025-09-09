import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { state } from '../utils/shared_functions';
import {
    fetchGoalCategories,
    fetchGoalStatuses,
    fetchMonthlyGoals,
    fetchGoalStatusViews,
    createGoalCategory,
    createGoalStatus,
    createMonthlyGoal,
    CreateGoalCategoryDto,
    CreateGoalStatusDto,
    CreateMonthlyGoalDto,
} from '../services/goalManagementService';

// Simple hook that fetches all goals data at once - similar to useAgentsHistory
const useGoalsData = (year: number, month: number, category?: string) => {
    const navigate = useNavigate();
    
    // Debug logging
    console.log('useGoalsData called with:', { 
        databaseName: state.databaseName, 
        year, 
        month, 
        category,
        isDatabaseNameValid: !!state.databaseName 
    });
    
    const categoriesQuery = useQuery({
        queryKey: ['goalCategories', state.databaseName],
        queryFn: () => {
            console.log('Calling fetchGoalCategories with database:', state.databaseName);
            return fetchGoalCategories(state.databaseName, navigate);
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!state.databaseName,
    });

    const statusesQuery = useQuery({
        queryKey: ['goalStatuses', state.databaseName],
        queryFn: () => {
            console.log('Calling fetchGoalStatuses with database:', state.databaseName);
            return fetchGoalStatuses(state.databaseName, navigate);
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!state.databaseName,
    });

    const monthlyGoalsQuery = useQuery({
        queryKey: ['monthlyGoals', state.databaseName, year, month],
        queryFn: () => fetchMonthlyGoals(state.databaseName, year, month, navigate),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!state.databaseName && year > 0 && month > 0, // Only fetch when year and month are specified
    });

    const statusViewsQuery = useQuery({
        queryKey: ['goalStatusViews', state.databaseName, year, month, category],
        queryFn: () => fetchGoalStatusViews(state.databaseName, year, month, category, navigate),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!state.databaseName && year > 0 && month > 0, // Only fetch when filters are specified
    });

    return {
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
};

// Mutation hooks for create operations
export const useCreateGoalCategory = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: (data: CreateGoalCategoryDto) =>
            createGoalCategory(state.databaseName, data, navigate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goalCategories'] });
        },
    });
};

export const useCreateGoalStatus = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: (data: CreateGoalStatusDto) =>
            createGoalStatus(state.databaseName, data, navigate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goalStatuses'] });
        },
    });
};

export const useCreateMonthlyGoal = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: (data: CreateMonthlyGoalDto) =>
            createMonthlyGoal(state.databaseName, data, navigate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monthlyGoals'] });
        },
    });
};

export default useGoalsData;
