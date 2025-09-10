import { getToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

// Types
export interface GoalCategory {
    CategoryId: number;
    CategoryName: string;
    Description: string;
    IsActive: boolean;
    CreatedAt: string;
}

export interface GoalStatus {
    StatusId: number;
    StatusName: string;
    Description: string;
    StatusKey: string;
    IsActive: boolean;
    CreatedAt: string;
}

export interface MonthlyGoal {
    GoalId: number;
    CategoryId: number;
    StatusId: number;
    Year: number;
    Month: number;
    TargetQuantity: number;
    CreatedBy: string;
    CreatedAt: string;
    UpdatedBy: string;
    UpdatedAt: string;
}

export interface GoalStatusView {
    CategoryName: string;
    Year: number;
    Month: number;
    Objectif: number;
    Total: number;
    Manque: number;
    MonthName: string;
}

export interface CreateGoalCategoryDto {
    CategoryName: string;
    Description?: string;
}

export interface CreateGoalStatusDto {
    StatusName: string;
    Description?: string;
    StatusKey: string;
}

export interface CreateMonthlyGoalDto {
    categoryName: string;
    statusName: string; // Required: which status this goal targets
    year: number;
    month: number;
    targetQuantity: number;
    createdBy: string;
}

export interface UpdateGoalCategoryDto {
    CategoryName?: string;
    Description?: string;
    IsActive?: boolean;
}

export interface UpdateGoalStatusDto {
    StatusName?: string;
    Description?: string;
    StatusKey?: string;
    IsActive?: boolean;
}

// Goal Categories Service Functions
export const fetchGoalCategories = async (
    database: string,
    navigate: (path: string) => void
): Promise<GoalCategory[]> => {
    const token = getToken();
    if (!token) navigate('/login');    
    const response = await fetch(`${API_URL}/goal-categories/list`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database })
    });
    if (!response.ok) throw new Error('Failed to fetch goal categories');
    const data = await response.json();
    return data;
};

export const createGoalCategory = async (
    database: string,
    data: CreateGoalCategoryDto,
    navigate: (path: string) => void
): Promise<GoalCategory> => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/goal-categories`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            database,
            ...data
        }),
    });

    if (!response.ok) throw new Error('Failed to create goal category');
    return response.json();
};

export const updateGoalCategory = async (
    database: string,
    id: number,
    data: UpdateGoalCategoryDto,
    navigate: (path: string) => void
): Promise<GoalCategory> => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/goal-categories/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            database,
            ...data
        }),
    });

    if (!response.ok) throw new Error('Failed to update goal category');
    return response.json();
};

export const deleteGoalCategory = async (
    database: string,
    id: number,
    navigate: (path: string) => void
): Promise<void> => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/goal-categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database }),
    });

    if (!response.ok) throw new Error('Failed to delete goal category');
};

export const restoreGoalCategory = async (
    database: string,
    id: number,
    navigate: (path: string) => void
): Promise<GoalCategory> => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/goal-categories/${id}/restore`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database }),
    });

    if (!response.ok) throw new Error('Failed to restore goal category');
    return response.json();
};

// Goal Statuses Service Functions
export const fetchGoalStatuses = async (
    database: string,
    navigate: (path: string) => void
): Promise<GoalStatus[]> => {
    const token = getToken();
    if (!token) navigate('/login');

    console.log("Fetching goal statuses for database:", database);

    const response = await fetch(`${API_URL}/goal-statuses/list`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database })
    });
    if (!response.ok) throw new Error('Failed to fetch goal statuses');
    const data = await response.json();
    return data;
};

export const createGoalStatus = async (
    database: string,
    data: CreateGoalStatusDto,
    navigate: (path: string) => void
): Promise<GoalStatus> => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/goal-statuses`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            database,
            ...data
        }),
    });

    if (!response.ok) throw new Error('Failed to create goal status');
    return response.json();
};

export const updateGoalStatus = async (
    database: string,
    id: number,
    data: UpdateGoalStatusDto,
    navigate: (path: string) => void
): Promise<GoalStatus> => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/goal-statuses/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            database,
            ...data
        }),
    });

    if (!response.ok) throw new Error('Failed to update goal status');
    return response.json();
};

export const deleteGoalStatus = async (
    database: string,
    id: number,
    navigate: (path: string) => void
): Promise<void> => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/goal-statuses/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database }),
    });

    if (!response.ok) throw new Error('Failed to delete goal status');
};

// Monthly Goals Service Functions
export const fetchMonthlyGoals = async (
    database: string,
    year?: number,
    month?: number,
    navigate?: (path: string) => void
): Promise<MonthlyGoal[]> => {
    const token = getToken();
    if (!token && navigate) navigate('/login');

    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());

    const url = `${API_URL}/monthly-goals/list${params.toString() ? `?${params}` : ''}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database })
    });

    if (!response.ok) throw new Error('Failed to fetch monthly goals');
    return response.json();
};

export const createMonthlyGoal = async (
    database: string,
    data: CreateMonthlyGoalDto,
    navigate: (path: string) => void
): Promise<MonthlyGoal> => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/monthly-goals/set-goal`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            database,
            ...data
        }),
    });

    if (!response.ok) throw new Error('Failed to create monthly goal');
    return response.json();
};

export const deleteMonthlyGoal = async (
    database: string,
    id: number,
    navigate: (path: string) => void
): Promise<void> => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/monthly-goals/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database }),
    });

    if (!response.ok) throw new Error('Failed to delete monthly goal');
};

// Goal Views Service Functions
export const fetchGoalStatusViews = async (
    database: string,
    year?: number,
    month?: number,
    category?: string,
    navigate?: (path: string) => void
): Promise<GoalStatusView[]> => {
    const token = getToken();
    if (!token && navigate) navigate('/login');

    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    if (category) params.append('category', category);

    const url = `${API_URL}/goal-views/monthly-status${params.toString() ? `?${params}` : ''}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database })
    });

    if (!response.ok) throw new Error('Failed to fetch goal status views');
    return response.json();
};

export const fetchDashboardGoalReport = async (
    database: string,
    year?: number,
    startMonth?: number,
    endMonth?: number,
    navigate?: (path: string) => void
): Promise<any[]> => {
    const token = getToken();
    if (!token && navigate) navigate('/login');

    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (startMonth) params.append('startMonth', startMonth.toString());
    if (endMonth) params.append('endMonth', endMonth.toString());

    const url = `${API_URL}/goal-views/dashboard${params.toString() ? `?${params}` : ''}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database })
    });

    if (!response.ok) throw new Error('Failed to fetch dashboard goal report');
    return response.json();
};

export const fetchCarCategorization = async (
    database: string,
    category?: string,
    model?: string,
    available?: boolean,
    navigate?: (path: string) => void
): Promise<any[]> => {
    const token = getToken();
    if (!token && navigate) navigate('/login');

    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (model) params.append('model', model);
    if (available !== undefined) params.append('available', available.toString());

    const url = `${API_URL}/goal-views/car-categorization${params.toString() ? `?${params}` : ''}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database })
    });

    if (!response.ok) throw new Error('Failed to fetch car categorization');
    return response.json();
};

// =============================
// Car Category Mapping Mutations
// =============================

// (Approximate) interface for car categorization rows; adjust as backend evolves
export interface CarCategorization {
    CarId: number;
    CategoryName?: string;
    CategoryId?: number;
    Model?: string;
    Version?: string;
    Available?: boolean;
    [key: string]: any; // fallback for unexpected fields
}

export const assignCarToCategory = async (
    database: string,
    carId: number,
    categoryName: string,
    navigate: (path: string) => void,
    statusName?: string
): Promise<{ success: boolean; message?: string } | CarCategorization> => {
    const token = getToken();
    if (!token) navigate('/login');

    const requestBody: any = {
        database,
        carId,
        categoryName
    };
    
    if (statusName) {
        requestBody.statusName = statusName;
    }

    const response = await fetch(`${API_URL}/car-category-mapping/assign`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error('Failed to assign car to category');
    return response.json();
};

export const autoCategorizeCars = async (
    database: string,
    navigate: (path: string) => void
): Promise<{ success: boolean; message?: string }> => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/car-category-mapping/auto-categorize`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ database })
    });
    if (!response.ok) throw new Error('Failed to auto-categorize cars');
    return response.json();
};
