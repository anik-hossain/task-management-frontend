import apiService from '@/utils/api';
import { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner"

// Define User interface
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
}

// Define AuthContext type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Response = {
    accessToken: string
    user: User
}

// AuthProvider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
     try {
            const response: Response = await apiService.login({ email, password });
            localStorage.setItem('token', response.accessToken)
            setUser(response.user);
            setIsAuthenticated(true);
            
            navigate('/dashboard')
            toast("Logged in successfully.", { style: { background: '#4caf50', color: '#fff' } })
        } catch (error) {
            toast("Invalid credentials.", { style: { background: '#f44336', color: '#fff' } })
        }
  }
  const register = async (name: string, email: string, password: string) => {
     try {
            const response: Response = await apiService.register({ name, email, password });
            localStorage.setItem('token', response.accessToken)
            setUser(response.user);
            setIsAuthenticated(true);
            
            navigate('/')
            toast("Register successfully.", { style: { background: '#4caf50', color: '#fff' } })
        } catch (error) {
            toast("Invalid credentials.", { style: { background: '#f44336', color: '#fff' } })
        }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
          const response = await apiService.get('/auth/me') as User
          setUser(response);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally{
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, isLoading }}>
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