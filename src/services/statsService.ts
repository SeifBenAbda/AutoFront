import { DossierStat } from "../hooks/useDashboard";
import { getToken, removeToken } from "./authService";
const API_URL = import.meta.env.VITE_API_URL;


export const fetchDossierStats = async (
  databaseName: string,
  status: string,
  navigate: (path: string) => void
): Promise<DossierStat[]> => {
  const token = getToken();
  console.log("status", status);
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

  console.log("response", response);

  if (response.status === 401) {
    removeToken();
    navigate("/login");
    throw new Error("Unauthorized: Token is invalid or expired");
  }

  if (!response.ok) throw new Error("Failed to fetch global stats");
  
  return response.json();
};
