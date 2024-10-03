import { Article } from "@/types/otherTypes";
import { CarRequest, Client, Devis, ItemRequest, Rappel } from "../types/devisTypes";
import { getToken, removeToken } from './authService';
import { User } from "../models/user.model";


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

export const updateUser = async (
  updatedUser?: Partial<User>,
  newUserName? : string | null
): Promise<{ user: User }> => {
  const token = getToken();

  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_URL}/users/me`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Directly sending the updatedUser object
    body: JSON.stringify({
      updatedUser,
      newUserName
    }),
  });

  if (!response.ok) throw new Error('Network response was not ok');

  return response.json();
};


export const updatePassword = async (
  newPassword? : string | null
): Promise<{ user: User }> => {
  const token = getToken();

  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_URL}/users/newPassword`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Directly sending the updatedUser object
    body: JSON.stringify({
      newPassword
    }),
  });

  if (!response.ok) throw new Error('Network response was not ok');

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


export const fetchCarModels = async (databasename: string, navigate: (path: string) => void) => {
  const token = getToken();
  if (!token) {
    navigate('/login');
    throw new Error('No token found');
  }

  const body = { database: databasename };

  try {
    const response = await fetch(`${API_URL}/cars`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      // Token is invalid or expired
      removeToken();
      navigate('/login');
      throw new Error('Unauthorized: Token is invalid or expired');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch car models');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
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
      throw new Error('Failed to fetch regions');
  }

  return response.json();
};

//fetching Banks And Leasing 
export const fetchBanksAndLeasing = async (databasename:string) => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const body = {"database":databasename}
  const response = await fetch(`${API_URL}/banks-and-leasing`, {
    method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
  });

  if (!response.ok) {
      throw new Error('Failed to fetch Banks and Leasing');
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


//Upload Documents : 
export const uploadDocuments = async (
  database: string,
  devisId: number,
  files: File[], // Accept an array of files
  navigate: (path: string) => void
) => {
  const token = getToken(); // Assume getToken retrieves the token
  if (!token) {
    navigate('/login');
    throw new Error('No token found');
  }

  const formData = new FormData();
  // Append each file to the FormData
  files.forEach(file => {
    formData.append('files', file); // Use the same key 'file' for all files
  });
  formData.append('database', database);
  formData.append('DevisId', devisId.toString());

  try {
    const response = await fetch(`${API_URL}/devis-documents/uploadFiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type' is not set for FormData; it will be automatically handled
      },
      body: formData,
    });

    if (response.status === 401) {
      // Token is invalid or expired
      removeToken(); // Assume removeToken clears the token
      navigate('/login');
      throw new Error('Unauthorized: Token is invalid or expired');
    }

    if (!response.ok) {
      throw new Error('Failed to upload documents');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const streamFile = async (filename: string, navigate: (path: string) => void) => {
  const token = getToken(); // Retrieve the token
  if (!token) {
      navigate('/login');
      throw new Error('No token found');
  }

  try {
      const response = await fetch(`${API_URL}/devis-documents/stream-file`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filename }), // Sending filename in request body
      });

      if (!response.ok) {
          throw new Error('Failed to stream file');
      }

      return response.blob(); // Return the blob from the response
  } catch (error) {
      console.error('Error streaming file:', error);
      throw error;
  }
};


export const getUrlFiles = async (database:string,devisId:string,filename: string , navigate: (path: string) => void) => {
  const token = getToken(); // Retrieve the token
  if (!token) {
    removeToken();
    navigate('/login');
      throw new Error('No token found');
  }

  try {
      const response = await fetch(`${API_URL}/devis-documents/get-url`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "database":database,
            "devisId":devisId,
            "filename":filename,
          }),
      });

      if (!response.ok) {
          throw new Error('Failed to get Url Docs');
          removeToken();
      navigate('/login');
      }

      return response
  } catch (error) {
      console.error('Error getting Url Docs:', error);
      throw error;
  }
};




interface FileData {
  id: number;
  DevisId: number;
  file_name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  uploaded_at: string;
}
export const getDevisFiles = async (database: string, devisId: string, navigate: (path: string) => void): Promise<FileData[]> => {
  const token = getToken(); // Retrieve the token
  if (!token) {
    removeToken();
      navigate('/login');
      throw new Error('No token found');
  }

  try {
      const response = await fetch(`${API_URL}/devis-documents/get-devis-files`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              "database": database,
              "devisId": devisId,
          }),
      });

      if (!response.ok) {
        removeToken();
          navigate('/login');
          throw new Error('Failed to fetch files');
      }

      return response.json();
  } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
  }
};



//-----------------Audio------------------------//
export const uploadAudio = async (
  formData: FormData, // Accept FormData as a parameter
  navigate: (path: string) => void
) => {
  const token = getToken(); // Assume getToken retrieves the token
  if (!token) {
    removeToken();
    navigate('/login');
    throw new Error('No token found');
  }

  try {
    const response = await fetch(`${API_URL}/devis-documents/uploadAudio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Note: Do not set Content-Type when sending FormData
      },
      body: formData, // Use FormData as the body
    });

    if (response.status === 401) {
      // Token is invalid or expired
      removeToken(); // Assume removeToken clears the token
      navigate('/login');
      throw new Error('Unauthorized: Token is invalid or expired');
    }

    if (!response.ok) {
      throw new Error('Failed to upload audio');
    }

    return await response.json(); // Return the response as JSON
  } catch (error) {
    console.error(error);
    throw error;
  }
};


// Utility function to convert a file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


export const getAudioFiles = async (
  database: string,
  devisId: number,
  navigate: (path: string) => void
) => {
  const token = getToken(); // Assume getToken retrieves the token
  if (!token) {
    removeToken();
    navigate('/login');
    throw new Error('No token found');
  }

  try {
    const response = await fetch(`${API_URL}/devis-documents/getAudioFiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ database, devisId }),
    });

    if (response.status === 401) {
      // Token is invalid or expired
      removeToken();
      navigate('/login');
      throw new Error('Unauthorized: Token is invalid or expired');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch audio files');
    }

    const data = await response.json();
    return data; // Assuming the API response structure is { status: 200, audioFiles: [] }
  } catch (error) {
    console.error(error);
    throw error;
  }
};


