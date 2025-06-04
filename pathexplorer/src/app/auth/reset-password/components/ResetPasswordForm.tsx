'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useVerifyOTP } from '@/app/auth/reset-password/hooks/useVerifyOTP';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { resetPasswordSchema, ResetPasswordFormData } from '@/schemas/auth/resetPasswordSchema';

export default function ResetPasswordForm() {
  const router = useRouter();
  const { verifyOTP, isLoading, error } = useVerifyOTP();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    const storedOTP = sessionStorage.getItem('resetOTP');

    if (!storedEmail || !storedOTP) {
      router.push('/auth/forgot-password');
      return;
    }

    setEmail(storedEmail);
    setOtp(storedOTP);
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const success = await verifyOTP({
      email,
      otp,
      password: data.password,
    });

    if (success) {
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetOTP');

      toast.success('Password reset successfully');

      // Redirect to login page
      router.push('/auth/LogIn');
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
                    Reset your password
        </p>
        <p className="text-gray-600 text-sm">
                    Enter your new password
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-6"
      >
        <div className="flex flex-col space-y-3">
          <Input
            type="password"
            placeholder="New Password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}

          <Input
            type="password"
            placeholder="Re-enter Password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
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
                                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </div>
      </form>

      <div className="w-full">
        <div className="flex flex-col justify-center">
          <Button
            className="cursor-pointer text-[#A001FE] p-0"
            variant={'link'}
            onClick={() => router.push('/auth/verify-otp')}
          >
                        Back
          </Button>
        </div>
      </div>
    </div>
  );
}
