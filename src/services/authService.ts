// services/authService.ts

export const saveToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Example of a function to handle login
export const loginUser = async (username: string, password: string) => {
  const response = await fetch('http://localhost:3000/auth/signin', {
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
  console.log('Access Token:', accessToken);

  return {accessToken} ;
};

// Example of a function to fetch user data (if needed)
export const fetchUserData = async () => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch('http://localhost:3000/users/me', {
    method: 'GET', // Use POST to send data in the body
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }


  return response.json();
};
