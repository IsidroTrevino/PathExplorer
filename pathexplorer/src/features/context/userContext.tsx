'use client';
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';

interface UserAuthData {
    userId: number;
    accessToken: string;
    tokenType: string;
}

interface UserDetails {
    id: number;
    name: string;
    email: string;
    position: string;
    seniority: number;
    rol: string;
}

interface UserContextType {
    userAuth: UserAuthData | null;
    userDetails: UserDetails | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitializing: boolean;
    error: string | null;
    setUserAuth: (data: UserAuthData) => void;
    setUserDetails: (data: UserDetails) => void;
    fetchUserDetails: (token: string) => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userAuth, setUserAuth] = useState<UserAuthData | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/my-info', {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError('Failed to fetch user details');
        return;
      }

      const userData = await response.json();
      setUserDetails(userData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching user details';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedAuth = localStorage.getItem('userAuth');
        if (savedAuth) {
          const parsedAuth = JSON.parse(savedAuth);
          setUserAuth(parsedAuth);
          await fetchUserDetails(parsedAuth.accessToken);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setTimeout(() => setIsInitializing(false), 0);
      }
    };

    initializeAuth();
  }, [fetchUserDetails]);

  const setUserAuthData = useCallback((data: UserAuthData) => {
    setUserAuth(data);
    localStorage.setItem('userAuth', JSON.stringify(data));

    Cookies.set('userAuthToken', data.accessToken, {
      expires: 7,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Llamamos a fetchUserDetails automáticamente al establecer la autenticación
    fetchUserDetails(data.accessToken);
  }, [fetchUserDetails]);

  const logout = useCallback(() => {
    setUserAuth(null);
    setUserDetails(null);
    localStorage.removeItem('userAuth');
    Cookies.remove('userAuthToken');
  }, []);

  return (
    <UserContext.Provider
      value={{
        userAuth,
        userDetails,
        isAuthenticated: !!userAuth,
        isLoading,
        isInitializing,
        error,
        setUserAuth: setUserAuthData,
        setUserDetails,
        fetchUserDetails,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
