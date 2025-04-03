import { useState } from "react";
import { LogInFormData } from "@/schemas/auth/logInSchema";
import { useUser } from "@/features/context/userContext";

interface LoginResponse {
  token: string;
}

interface UseLoginReturn {
  login: (data: LogInFormData) => Promise<LoginResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUserAuth } = useUser();

  const login = async (data: LogInFormData): Promise<LoginResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login failed");
        return null;
      }

      setUserAuth({
        userId: result.user_id,
        accessToken: result.access_token,
        tokenType: result.token_type,
      });

      return { token: result.access_token };
    } catch (err) {
      setError("An error occurred. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};