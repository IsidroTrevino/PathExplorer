'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/schemas/auth/forgotPasswordSchema';
import { useSendOTP } from '@/app/auth/forgot-password/hooks/useSendOTP';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { sendOTP, isLoading, error: hookError } = useSendOTP();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const getErrorMessage = () => {
    if (errors.email) return errors.email.message;
    if (serverError) return serverError;
    if (hookError) return hookError;
    return null;
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    const success = await sendOTP(data.email);

    if (success) {
      sessionStorage.setItem('resetEmail', data.email);
      router.push('/auth/verify-otp');
    } else {
      setServerError('Failed to send OTP. Please try again.');
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
            Forgot your password?
        </p>
        <p className="text-gray-600 text-sm">
            Enter your email below to receive a verification code
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-6"
      >
        <div className="flex flex-col space-y-3">
          <Input type="email" placeholder="Email" {...register('email')} />
          {getErrorMessage() && (
            <p className="text-red-500 text-xs mt-1">
              {getErrorMessage()}
            </p>
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
                    Sending...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </form>

      <div className="w-full">
        <div className="flex flex-col justify-center">
          <Button
            className="cursor-pointer text-[#A001FE] p-0"
            variant="link"
            onClick={() => router.push('/auth/LogIn')}
          >
              Back to LogIn
          </Button>
        </div>
      </div>
    </div>
  );
}
