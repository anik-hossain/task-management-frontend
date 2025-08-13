import apiService from '@/utils/api';
import { useState, useEffect, useContext, createContext } from 'react';

// Define User interface
interface User {
  id: string;
  role: 'admin' | 'manager' | 'user';
  username: string;
}

// Define AuthContext type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({id: '1', role: 'admin', username: 'admin'});
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Check for existing auth token on mount (e.g., from localStorage or backend)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await apiService.get('http://localhost:3000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('User data:', response);
          // setUser(response.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);


  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};