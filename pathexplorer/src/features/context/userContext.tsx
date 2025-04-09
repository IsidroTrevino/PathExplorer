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
    last_name_1: string;
    last_name_2: string;
    phone_number: string;
    location: string;
    capability: string;
    position: string;
    seniority: number;
    role: string;
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
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching user details:', err);
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    const storedAuth = Cookies.get('userAuthToken');

    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setUserAuth(parsedAuth);
        fetchUserDetails(parsedAuth.accessToken);
      } catch (err) {
        console.error('Error parsing stored auth:', err);
        Cookies.remove('userAuthToken');
        setIsInitializing(false);
      }
    } else {
      setIsInitializing(false);
    }
  }, [fetchUserDetails]);

  const setUserAuthData = useCallback((data: UserAuthData) => {
    setUserAuth(data);
    Cookies.set('userAuthToken', JSON.stringify(data), { expires: 1 });
  }, []);

  const logout = useCallback(() => {
    setUserAuth(null);
    setUserDetails(null);
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
