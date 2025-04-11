import { useState } from 'react';
import { CompleteSignUpData } from '@/schemas/auth/signUpSchema';
import { useUser } from '@/features/context/userContext';

interface RegisterResponse {
  success: boolean;
  message: string;
  user_id: number;
  access_token: string;
  token_type: string;
}

interface UseRegisterReturn {
  register: (data: CompleteSignUpData) => Promise<RegisterResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUserAuth, fetchUserDetails } = useUser();

  const register = async (data: CompleteSignUpData): Promise<RegisterResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          last_name_1: data.last_name_1,
          last_name_2: data.last_name_2 || '',
          phone_number: data.phone_number,
          location: data.location,
          capability: data.capability,
          position: data.position,
          seniority: parseInt(data.seniority),
          role: data.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Registration failed');
        return {
          success: false,
          message: result.message || 'Registration failed',
          user_id: 0,
          access_token: '',
          token_type: '',
        };
      }

      setUserAuth({
        userId: result.user_id,
        accessToken: result.access_token,
        tokenType: result.token_type,
      });

      await fetchUserDetails(result.access_token);

      return {
        success: true,
        ...result,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        user_id: 0,
        access_token: '',
        token_type: '',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};
