import { Article } from "@/types/otherTypes";
import { CarRequest, Client, Devis, ItemRequest, Rappel } from "../types/devisTypes";
import { getToken, removeToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL;


export const fetchUserData = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found fethcu ser data');

  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch user data');

  return response.json();
};



interface ApiResponse {
  data: Devis[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export const fetchDevisDetailled = async (page: number): Promise<ApiResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found fetchMVTVENLI');
  }
  const response = await fetch(`${API_URL}/mvt-venli?page=${page}`,

    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};



export const fetchDevisAllData = async (
  database: string,
  clientName?: string,
  page: number = 1,
  status?:string, 
  priority?:string,
  cars?:string[]
): Promise<ApiResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }

  const endpoint = clientName ? '/devis/filter-client' : '/devis/completeDevis';
  const body = clientName 
    ? { database, clientName, page ,status,priority,cars}
    : { database, page ,status,priority,cars};

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) { // Token is invalid or expired
      removeToken();
      throw new Error('Unauthorized: Token is invalid or expired');
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (e) {
    // Handle errors other than network errors
    console.error(e);
    throw e; // Rethrow the error to handle it elsewhere if needed
  }
};


export const fetchCarModels = async (databasename:string) => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const body = {"database":databasename}
  const response = await fetch(`${API_URL}/cars`, {
    method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
  });

  if (!response.ok) {
      throw new Error('Failed to fetch car models');
  }

  return response.json();
};


//fetching Regions 
export const fetchRegions = async (databasename:string) => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const body = {"database":databasename}
  const response = await fetch(`${API_URL}/regions`, {
    method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
  });

  if (!response.ok) {
      throw new Error('Failed to fetch car models');
  }

  return response.json();
};




//This Part is Responsbale to Update my Devis : 
export const updateDevis = async (
  database: string,
  devisId: number,
  clientId: number,
  updatedDevis: Partial<Devis>,
  updatedClient?: Partial<Client>,
  updatedItemRequestData?: Partial<ItemRequest>,
  updatedCarRequestData?: Partial<CarRequest>,
  updatedRappels?: Partial<Rappel[]>
): Promise<{ client?: Client; devis: Devis; carRequest?: CarRequest; itemRequest?: ItemRequest ;rappels?: Rappel[]}> => {
  const token = getToken();

  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_URL}/devis/update`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "devisId":devisId,
      "database":database,
      "clientId": clientId,
      "updatedDevis":updatedDevis,
      "updatedClient": updatedClient,
      "updatedItemRequest": updatedItemRequestData,
      "updatedCarRequest" : updatedCarRequestData,
      "updatedRappels":updatedRappels
    }),
  });

  if (!response.ok) throw new Error('Network response was not ok');

  return response.json();
};


export const createDevis = async (
  database: string,
  client: Client,
  devis: Devis,
  itemRequestData?: ItemRequest[],
  carRequestData?: CarRequest,
  rappelData? : Rappel[]
) => {
  const token = getToken();

  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_URL}/devis`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "database":database,
      "client":client,
      "devis":devis,
      "itemRequest":itemRequestData,
      "carRequest":carRequestData,
      "rappelsDevis":rappelData
    }),
  });

  if (!response.ok) {
    throw new Error('Error creating Devis');
  }

  return response.json();
};  



//fetching Articles : 
export const fetchArticles = async (
  database: string,
  searchValue?: string,
  page: number = 1
): Promise<{ data: Article[], meta: { totalItems: number, totalPages: number, currentPage: number } }> => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }

  const body = {
    database,
    page,
    searchValue: searchValue || ''
  };

  try {
    const response = await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) { // Token is invalid or expired
      removeToken();
      throw new Error('Unauthorized: Token is invalid or expired');
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
};



//Fetch Clients with Pagination 

export const fetchClients = async (
  database: string,
  searchValue?: string,
  page: number = 1
): Promise<{ data: Client[], meta: { totalItems: number, totalPages: number, currentPage: number } }> => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }

  const body = {
    database,
    page,
    searchValue: searchValue || ''
  };

  try {
    const response = await fetch(`${API_URL}/clients/allClients`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) { // Token is invalid or expired
      removeToken();
      throw new Error('Unauthorized: Token is invalid or expired');
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
};