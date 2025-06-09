import { Article } from "@/types/otherTypes";
import { CarRequest, Client, Devis, DevisFacture, DevisGesteCommer, DevisPayementDetails, DevisReserved, HttpStatus, Rappel } from "../types/devisTypes";
import { getToken, removeToken } from './authService';
import { User } from "../models/user.model";
import { generateBcInterneResponse } from "../hooks/useUploadFiles";
import { CarModel } from "@/hooks/useCars";


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


export const getDatabasesAccess = async (username: string): Promise<string[]> => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_URL}/agent-database-access/get-accessed-databases`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) throw new Error('Network response was not ok');

  const data = await response.json();
  if (!data || data.length === 0) throw new Error('No databases access found');

  return data;
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


export const createUser = async (
  password: string,
  createdUser?: Partial<User>
): Promise<{ user: User }> => {
  const token = getToken();

  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_URL}/users/newUser`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Directly sending the updatedUser object
    body: JSON.stringify({
      "user":createdUser,
      "password":password
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
  searchValue?: string,
  page: number = 1,
  status?:string, 
  priority?:string,
  cars?:string[],
  clients?:string[],
  dateRappelFrom?: Date | undefined,
  dateRappelTo?: Date | undefined
): Promise<ApiResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }

  const endpoint = searchValue ? '/devis/searchDevis' : '/devis/completeDevis';
  const body = searchValue 
    ? { database, searchValue, page ,status,priority,cars,clients,dateRappelFrom,dateRappelTo}
    : { database, page ,status,priority,cars,clients,dateRappelFrom,dateRappelTo};

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


export const fetchCarsPaginated = async (
  databasename: string,
  page: number = 1,
  pageSize: number = 7,
  navigate: (path: string) => void,
  searchTerm: string = ''
) => {
  const token = getToken();
  if (!token) {
    navigate('/login');
    throw new Error('No token found');
  }

  const body = { 
    database: databasename,
    page,
    pageSize,
    searchTerm
  };

  try {
    const response = await fetch(`${API_URL}/cars/paginated`, {
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
      throw new Error('Failed to fetch paginated cars data');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};



export const createCar = async (
  database: string,
  newCar: Partial<CarModel>,
  createdBy: string,
  navigate: (path: string) => void
) => {
  const token = getToken();
  if (!token) {
    navigate('/login');
    throw new Error('No token found');
  }

  const body = { database, newCar,createdBy };

  try {
    const response = await fetch(`${API_URL}/cars/create`, {
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
      throw new Error('Failed to create car');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const updateCar = async (
  database: string,
  navigate: (path: string) => void,
  updatedCar: Partial<CarModel>,
) => {
  const token = getToken();
  if (!token) {
    navigate('/login');
    throw new Error('No token found');
  }

  const body = { database, updatedCar };

  try {
    const response = await fetch(`${API_URL}/cars/update`, {
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
      throw new Error('Failed to update car');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}



export const fetchCarModelsFacture = async (databasename: string, navigate: (path: string) => void) => {
  const token = getToken();
  if (!token) {
    navigate('/login');
    throw new Error('No token found');
  }
  const body = { database: databasename };
  try {
    const response = await fetch(`${API_URL}/cars/cars-facture`, {
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
}


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


//fetching Client Sectors 
export const fetchClientSectors = async (databasename:string) => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const body = {"database":databasename}
  const response = await fetch(`${API_URL}/client-sectors`, {
    method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
  });

  if (!response.ok) {
      throw new Error('Failed to fetch client Sectors');
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
  updatedCarRequestData?: Partial<CarRequest>,
  updatedRappels?: Partial<Rappel[]>,
  updatedDevisFacture?: Partial<DevisFacture>,
  updatedDevisReserved?: Partial<DevisReserved>,
  updatedDevisPayementDetails?: Partial<DevisPayementDetails>,
  updatedDevisGesteCommerciale?: Partial<DevisGesteCommer>
): Promise<{ client?: Client; devis: Devis; carRequest?: CarRequest ;rappels?: Rappel[];
  devisFacture?: DevisFacture; devisReserved?: DevisReserved; devisPayementDetails?: DevisPayementDetails
}> => {
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
      "updatedCarRequest" : updatedCarRequestData,
      "updatedRappels":updatedRappels,
      "updatedDevisFacture": updatedDevisFacture,
      "updatedDevisReserved":updatedDevisReserved,
      "updatedDevisPayementDetails":updatedDevisPayementDetails,
      "updatedDevisGesteCommerciale":updatedDevisGesteCommerciale
    }),
  });

  if (!response.ok) throw new Error('Network response was not ok');

  return response.json();
};


export const deletedDevis = async (
  database: string,
  devisId: number,
  deletedBy: string
): Promise<{ devis?: Devis; status: HttpStatus }> => {  // Adjusted return type
  const token = getToken();

  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_URL}/devis/delete`, {  // Adjusted the endpoint to match the backend
    method: 'POST',  // Or 'PATCH' if your backend uses it for updates
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      devisId,
      database,
      deletedBy,
    }),
  });

  if (!response.ok) throw new Error('Network response was not ok');

  const result = await response.json();

  // Handle the status and optional devis data
  return {
    status: result.status,  // Assuming the backend returns 'status' as part of the response
    devis: result.data?.devis,  // Optional 'devis' object
  };
};



export const createDevis = async (
  database: string,
  client: Client,
  devis: Devis,
  carRequestData?: CarRequest,
  rappelData? : Rappel[],
  devisPayementDetails? : DevisPayementDetails
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
      "carRequest":carRequestData,
      "rappelsDevis":rappelData,
      "devisPayementDetails":devisPayementDetails
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


export const fetchClientsAll = async (
  database: string
): Promise<Client[]> => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await fetch(`${API_URL}/clients?database=${encodeURIComponent(database)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 401) {
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
  files: { file: File; typeDocument: string }[], 
  navigate: (path: string) => void
) => {
  const token = getToken();
  if (!token) {
    navigate('/login');
    throw new Error('No token found');
  }

  const formData = new FormData();

  // Append each file and its associated `typeDocument` with unique keys
  files.forEach((doc, index) => {
    formData.append(`file`, doc.file);            // Unique key for each file
    formData.append(`typeDocument`, doc.typeDocument);  // Unique key for each typeDocument
  });

  formData.append('database', database);
  formData.append('DevisId', devisId.toString());

  try {
    const response = await fetch(`${API_URL}/devis-documents/uploadFiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (response.status === 401) {
      removeToken();
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
  typeDocument : string;
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




export const fetchDocCheck = async (databasename: string,clientType: string,payementType: string, navigate: (path: string) => void) => {
  const token = getToken();
  if (!token) {
    navigate('/login');
    throw new Error('No token found');
  }

  const body = { database: databasename ,clientType:clientType,payementType:payementType};

  try {
    const response = await fetch(`${API_URL}/document-conditions/specific`, {
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



export const generateBcInterne = async (databasename: string,devisId: number, navigate: (path: string) => void): Promise<generateBcInterneResponse> => {
  const token = getToken();
  if (!token) {
    navigate('/login');
    throw new Error('No token found');
  }

  const body = { database: databasename ,devisId:devisId};

  try {
    const response = await fetch(`${API_URL}/devis-documents/generateBcInterne`, {
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
      throw new Error('Failed to generate BC Interne');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
  