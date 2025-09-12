import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { state } from '../utils/shared_functions';
import { exportGoals, ExportGoalsOptions } from '../services/exportService';

export const useExportGoals = () => {
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: (options: ExportGoalsOptions) =>
            exportGoals(state.databaseName, options, navigate),
        onError: (error: any) => {
            console.error('Export failed:', error);
        }
    });
};
