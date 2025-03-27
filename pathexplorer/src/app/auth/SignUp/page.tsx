'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { signUpSchema, SignUpFormData } from '@/schemas/auth/signUpSchema';
import MicrosoftColorLogo from '@/components/GlobalComponents/microsoftLogo';

export default function SignUpPage() {
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: SignUpFormData) {
    console.log(values);
    //! TODO - Integrate API
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-purple-200 via-white to-transparent pointer-events-none z-0" />
      <div className="z-10 w-full max-w-sm px-6 flex flex-col items-center space-y-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <Image
              src={'/accenture/Acc_Logo_Black_Purple_RGB.png'}
              alt={'accenture logo'}
              width={263}
              height={69}
            />
          </div>
          <p className="text-black text-lg font-semibold pt-4">
                        Create an account
          </p>
          <p className="text-gray-600 text-sm">
                        Enter the required information to create an account.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col space-y-6">
            <div className="flex flex-col space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Confirm Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                className="w-full bg-gradient-to-br from-[#A001FE] via-violet-600 to-gray-800 hover:opacity-95 cursor-pointer"
                type="submit"
              >
                                Sign Up
              </Button>

              <div className="flex items-center space-x-2 w-full">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-xs whitespace-nowrap">OR CONTINUE WITH</span>
                <Separator className="flex-1" />
              </div>

              <Button className="w-full bg-white text-black hover:bg-gray-50 border border-gray-300 cursor-pointer gap-3" type="button">
                <MicrosoftColorLogo /> <span>Log in with Microsoft</span>
              </Button>
            </div>
          </form>
        </Form>

        <div className="w-full">
          <div className="flex justify-center">
            <Button className="cursor-pointer text-[#A001FE] p-0" variant="link" onClick={() => router.push('/auth/LogIn')}>
                            Already have an account? Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
