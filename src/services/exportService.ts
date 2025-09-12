import { getToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export interface ExportGoalsOptions {
    exportType: 'pdf' | 'excel';
    year?: number;
    months?: number[]; // Array of month numbers (1-12)
    categories?: string[]; // Array of category names
    groupBySemester?: boolean; // If true, group data by 6-month periods
    includeDetails?: boolean; // Include detailed breakdown
}

export const exportGoals = async (
    database: string,
    options: ExportGoalsOptions,
    navigate: (path: string) => void
): Promise<void> => {
    const token = getToken();
    if (!token) navigate('/login');

    try {
        const response = await fetch(`${API_URL}/exports/goals`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                database,
                ...options
            }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'export des données');
        }

        // Get the filename from the Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `rapport_objectifs.${options.exportType === 'pdf' ? 'pdf' : 'xlsx'}`;
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }

        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Export error:', error);
        throw error;
    }
};
