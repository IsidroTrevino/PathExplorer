'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ResetFormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetFormData) => {
    // TODO: Integrate your API call here
    console.log('Form Data:', data);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white overflow-hidden">
      {/* Gradient background */}
      <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-purple-200 via-white to-transparent pointer-events-none z-0" />

      {/* Main container */}
      <div className="z-10 w-full max-w-sm px-6 flex flex-col items-center space-y-10">
        {/* Header / Logo */}
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

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col space-y-6"
        >
          <div className="flex flex-col space-y-3">
            <Input
              type="password"
              placeholder="New Password"
              {...register('password', { required: true })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">
                Please enter your new password.
              </p>
            )}

            <Input
              type="password"
              placeholder="Re-enter Password"
              {...register('confirmPassword', { required: true })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                Please re-enter your new password.
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              className="w-full bg-gradient-to-br from-[#A001FE] via-violet-600 to-gray-800 hover:opacity-95 cursor-pointer"
              type="submit"
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
