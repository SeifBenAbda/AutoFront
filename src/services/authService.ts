const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('API_URL is not defined in the environment variables');
}

// Save both token and expiration time
export const saveToken = (token: string, expiresAt?: number) => {
  localStorage.setItem('authToken', token);
  
  // If expiresAt is provided, save it
  
    // If not provided, calculate it from the token
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const calculatedExpiresAt = decodedToken.exp * 1000; // Convert to milliseconds
      localStorage.setItem('expiresAt', calculatedExpiresAt.toString());
    } catch (error) {
      console.error('Failed to decode token for expiration:', error);
    }
  
};

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getExpiresAt = (): number | null => {
  const expiresAt = localStorage.getItem('expiresAt');
  return expiresAt ? parseInt(expiresAt, 10) : null;
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('expiresAt');
};

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Échec de la connexion. Vos identifiants sont incorrects ou votre compte est inactif.');
  }

  const data = await response.json();
  
  return { 
    accessToken: data.accessToken,
    expiresAt: data.expiresAt || undefined
  };
};

export const logoutUser = async (username: string) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username }) // Assuming the backend expects the token in the body
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

};


export const forceDisconnectUser = async (username: string) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }
  const response = await fetch(`${API_URL}/users/disconnect-remote-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username })
  });

  if (!response.ok) {
    throw new Error('Force disconnect failed');
  }

  return response.json();
};


export const activateRemoteUser = async (username: string) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }
  const response = await fetch(`${API_URL}/users/activate-remote-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username })
  });

  if (!response.ok) {
    throw new Error('Activation failed');
  }

  console.log("Response from server  : ", response);

  return response.json();
};

export const refreshToken = async () => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  
  // Save the new token and expiration
  saveToken(data.accessToken, data.expiresAt);

  return {
    accessToken: data.accessToken,
    expiresAt: data.expiresAt
  };
};

export const fetchUserData = async () => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return null;
    }
  
    return response.json();
  } catch(e) {
    return null;
  }
};