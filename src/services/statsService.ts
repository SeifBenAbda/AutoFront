import { CarRequestStats, DocumentMissingData, DocumentMissingStats, DossierStat, PlanningRappel } from "../hooks/useDashboard";
import { getToken, removeToken } from "./authService";
const API_URL = import.meta.env.VITE_API_URL;


export const fetchDossierStats = async (
  databaseName: string,
  status: string,
  navigate: (path: string) => void
): Promise<DossierStat[]> => {
  const token = getToken();
  if (!token) throw new Error("No token found fethcu ser data");

  const response = await fetch(`${API_URL}/dashboard/global-stats`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "database": databaseName,
      "status": status,
    }),
  });


  if (response.status === 401) {
    removeToken();
    navigate("/login");
    throw new Error("Unauthorized: Token is invalid or expired");
  }

  if (!response.ok) throw new Error("Failed to fetch global stats");
  
  return response.json();
};


export const fetchCarRequestStats = async (
  databaseName: string,
  carModels: string[],
  navigate: (path: string) => void
): Promise<CarRequestStats> => {
  const token = getToken();
  if (!token) throw new Error("No token found fetch Car Request Stats data");

  const response = await fetch(`${API_URL}/dashboard/carRequest-stats`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "database": databaseName,
      "carModels": carModels,
    }),
  });

  if (response.status === 401) {
    removeToken();
    navigate("/login");
    throw new Error("Unauthorized: Token is invalid or expired");
  }

  if (!response.ok) throw new Error("Failed to fetch car models stats");
  
  return response.json();
};


export const fetchDocumentMissingStats = async (
  databaseName: string,
  page: number,
  status: string,
  navigate: (path: string) => void
): Promise<DocumentMissingStats> => {
  const token = getToken();
  if (!token) throw new Error("No token found document stats data");
  const response = await fetch(`${API_URL}/dashboard/documents-stats`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "database": databaseName,
      "page": page,
      "status": status,
    }),
  });

  

  if (response.status === 401) {
    removeToken();
    navigate("/login");
    throw new Error("Unauthorized: Token is invalid or expired");
  }

  if (!response.ok) throw new Error("Failed to fetch document stats");
  return response.json();
}


export const fetchPlanningRappels = async (
  databaseName: string,
  page: number,
  startingDate: Date,
  endingDate: Date,
  selectedCreator: string,
  navigate: (path: string) => void
): Promise<PlanningRappel> => {
  const token = getToken();
  if (!token) throw new Error("No token found fetch planning rappels data");
  const response = await fetch(`${API_URL}/dashboard/planning-rappels`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "database": databaseName,
      "page": page,
      "startingDate": startingDate,
      "endingDate": endingDate,
      "selectedCreator": selectedCreator,
    }),
  });

  if (response.status === 401) {
    removeToken();
    navigate("/login");
    throw new Error("Unauthorized: Token is invalid or expired");
  }

  if (!response.ok) throw new Error("Failed to fetch planning rappels");
  return response.json();
}

export const fetchOverdueRappels = async (
  databaseName: string,
  page: number,
  startingDate: Date,
  endingDate: Date,
  selectedCreator: string,
  navigate: (path: string) => void
): Promise<PlanningRappel> => {
  const token = getToken();
  if (!token) throw new Error("No token found fetch planning rappels data");
  const response = await fetch(`${API_URL}/dashboard/overdue-rappels`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "database": databaseName,
      "page": page,
      "startingDate": startingDate,
      "endingDate": endingDate,
      "selectedCreator": selectedCreator,
    }),
  });

  if (response.status === 401) {
    removeToken();
    navigate("/login");
    throw new Error("Unauthorized: Token is invalid or expired");
  }

  if (!response.ok) throw new Error("Failed to fetch planning rappels");
  return response.json();
}