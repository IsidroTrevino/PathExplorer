'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

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
    error: string | null;
    setUserAuth: (data: UserAuthData) => void;
    setUserDetails: (data: UserDetails) => void;
    fetchUserDetails: (userId: number, token: string) => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userAuth, setUserAuth] = useState<UserAuthData | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async (userId: number, token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}`, {
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

  const logout = useCallback(() => {
    setUserAuth(null);
    setUserDetails(null);
    localStorage.removeItem('userAuth');
  }, []);

  return (
    <UserContext.Provider
      value={{
        userAuth,
        userDetails,
        isAuthenticated: !!userAuth,
        isLoading,
        error,
        setUserAuth,
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
