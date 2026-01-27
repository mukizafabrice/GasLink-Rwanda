import { navigate } from 'react-router-dom';

export const logoutUser = async (navigate: any) => {
  try {
    const token = localStorage.getItem('token');
    
    // Call backend logout endpoint
    if (token) {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    }

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear any other auth-related data
    sessionStorage.clear();
    
    // Redirect to login with logout parameter
    navigate('/login?logout=true');
    
    return { success: true, message: 'Logged out successfully' };
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear local storage even if API fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    navigate('/login');
    return { success: false, message: 'Logged out (API error)' };
  }
};

// Alternative: Simple logout without API call
export const simpleLogout = (navigate: any) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.clear();
  navigate('/login?logout=true');
  return { success: true, message: 'Logged out' };
};