const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('API_URL is not defined in the environment variables');
}

export const saveToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
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
    throw new Error('Login failed');
  }

  const { accessToken } = await response.json();
  return { accessToken };
};

export const fetchUserData = async () => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }

  try{
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      //throw new Error('Failed to fetch user data');
    }
  
    return response.json();
  }catch(e){
    return null ;
  }

  
};
