'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useSendOTP } from '@/app/auth/forgot-password/hooks/useSendOTP';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { sendOTP, isLoading, error } = useSendOTP();
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
    <div className="relative flex justify-center items-center min-h-screen bg-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-purple-200 via-white to-transparent pointer-events-none z-0" />
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
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
            {serverError && (
              <p className="text-red-500 text-xs mt-1">
                {serverError}
              </p>
            )}
            {error && (
              <p className="text-red-500 text-xs mt-1">
                {error}
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
              variant={'link'}
              onClick={() => router.push('/auth/LogIn')}
            >
                Back to LogIn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
