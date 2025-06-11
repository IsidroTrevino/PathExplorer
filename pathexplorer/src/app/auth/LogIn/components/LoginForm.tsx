'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { logInSchema, LogInFormData } from '@/schemas/auth/logInSchema';
import { useLogin } from '@/app/auth/LogIn/hooks/useLogin';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import MicrosoftColorLogo from '@/components/microsoftLogo';
import { LoginResponse } from '@/app/auth/SignUp/types/loginTypes';

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useLogin();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormData>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LogInFormData) => {
    setError(null);
    try {
      const response: LoginResponse | null = await login(data);

      if (
        (response && response.success) ||
          (response && response.token) ||
          (response && !response.error)
      ) {
        router.replace('/user/dashboard');
      } else {
        const errorMessage = 'Login failed. Please try again.';

        setError(errorMessage);
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="z-10 w-full max-w-sm px-6 flex flex-col items-center space-y-10">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <Image
            src="/accenture/Acc_Logo_Black_Purple_RGB.png"
            alt="logo-accenture"
            width={263}
            height={69}
          />
        </div>
        <p className="text-black text-lg font-semibold pt-4">
                    Log in to your account
        </p>
        <p className="text-gray-600 text-sm">
                    Enter your email and password below to log in
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-6"
      >
        <div className="flex flex-col space-y-3">
          <Input
            type="email"
            placeholder="Email"
            {...register('username')}
            disabled={isLoading}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <Button
            className="w-full bg-gradient-to-br from-[#A001FE] via-violet-600 to-gray-800 hover:opacity-95 cursor-pointer"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging In...
              </>
            ) : (
              'Log In with Email'
            )}
          </Button>

          <div className="flex items-center space-x-2 w-full">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              OR CONTINUE WITH
            </span>
            <Separator className="flex-1" />
          </div>

          <Button
            className="w-full bg-white text-black hover:bg-gray-50 border border-gray-300 cursor-pointer gap-3"
            type="button"
            disabled={isLoading}
          >
            <MicrosoftColorLogo /> <span>Log in with Microsoft</span>
          </Button>
        </div>
      </form>

      <div className="w-full">
        <div className="flex flex-col justify-center">
          <Button
            className="cursor-pointer text-[#A001FE] p-0"
            variant="link"
            onClick={() => router.push('/auth/SignUp')}
            disabled={isLoading}
          >
                        Don't have an account? Sign Up
          </Button>
          <Button
            className="cursor-pointer text-[#A001FE] p-0"
            variant="link"
            onClick={() => router.push('/auth/forgot-password')}
            disabled={isLoading}
          >
                        Forgot your password?
          </Button>
        </div>
      </div>
    </div>
  );
}
