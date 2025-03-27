'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { logInSchema, LogInFormData } from '@/schemas/auth/logInSchema';
import { useRouter } from 'next/navigation';
import MicrosoftColorLogo from '@/components/GlobalComponents/microsoftLogo';

export default function LogInPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormData>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: LogInFormData) => {
    console.log('Form Data:', data);
    // TODO: Integrate API
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-purple-200 via-white to-transparent pointer-events-none z-0" />
      <div className="z-10 w-full max-w-sm px-6 flex flex-col items-center space-y-10">
        <div className="flex flex-col items-center text-cente">
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
            <Input type="email" placeholder="Email" {...register('email')} />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
            <Input type="password" placeholder="Password" />
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              className="w-full bg-gradient-to-br from-[#A001FE] via-violet-600 to-gray-800 hover:opacity-95 cursor-pointer"
              type="submit"
            >
              Log In with Email
            </Button>

            <div className="flex items-center space-x-2 w-full">
              <Separator className="flex-1" />
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                OR CONTINUE WITH
              </span>
              <Separator className="flex-1" />
            </div>

            <Button className="w-full bg-white text-black hover:bg-gray-50 border border-gray-300 cursor-pointer gap-3" type="button">
              <MicrosoftColorLogo /> <span>Log in with Microsoft</span>
            </Button>
          </div>
        </form>

        <div className="w-full">
          <div className="flex justify-center">
            <Button
              className="cursor-pointer text-[#A001FE] p-0"
              variant={'link'}
              onClick={() => router.push('/auth/SignUp')}
            >
              Don't have an account? Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
