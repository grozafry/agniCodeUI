// API base URL
const API_BASE_URL = 'http://127.0.0.1:5000/';

// Utility function to refresh token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    const response = await fetch(`${API_BASE_URL}auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token); // Update access token
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
};

// Utility function for making authenticated API calls
const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem('access_token');

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  let response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  // If access token has expired, try to refresh it
  if (response.status === 401) {
    console.log('Access token expired, trying to refresh...');
    token = await refreshAccessToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`; // Update authorization header with new token
      response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
    } else {
      throw new Error('Unable to refresh token');
    }
  }

  if (!response.ok) {
    throw new Error('API call failed');
  }

  return response.json();
};

export default fetchWithAuth;
