'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SignUpStepOneData, signUpStepOneSchema } from '@/schemas/auth/signUpSchema';
import MicrosoftColorLogo from '@/components/GlobalComponents/microsoftLogo';
import { PhoneNumberInput } from '@/components/GlobalComponents/phoneInput';

export default function SignUpPage() {
  const router = useRouter();

  const form = useForm<SignUpStepOneData>({
    resolver: zodResolver(signUpStepOneSchema),
    defaultValues: {
      name: '',
      last_name_1: '',
      last_name_2: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone_number: '',
    },
  });

  function onSubmit(values: SignUpStepOneData) {
    localStorage.setItem('signUpStepOne', JSON.stringify(values));
    router.push('/auth/SignUp/additional-info');
  }

  return (
    <div className=" p-10 relative flex justify-center items-center min-h-screen bg-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-purple-200 via-white to-transparent pointer-events-none z-0" />
      <div className="z-10 w-full max-w-xl px-6 flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-1">
            <Image
              src={'/accenture/Acc_Logo_Black_Purple_RGB.png'}
              alt={'accenture logo'}
              width={200}
              height={52}
            />
          </div>
          <p className="text-black text-lg font-semibold pt-1">
                        Create an account
          </p>
          <p className="text-gray-600 text-sm">
                        Enter the required information to create an account.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col space-y-4">
            <div>
              <h2 className="text-xl font-medium mb-2">Personal Information</h2>
              <Separator className="mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="relative pb-5">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <div className="absolute bottom-0 left-0">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name_1"
                  render={({ field }) => (
                    <FormItem className="relative pb-5">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <div className="absolute bottom-0 left-0">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name_2"
                  render={({ field }) => (
                    <FormItem className="relative pb-5">
                      <FormLabel>Second Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <div className="absolute bottom-0 left-0">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-xl font-medium mb-2">Contact & Security</h2>
              <Separator className="mb-3" />
              <div className="flex flex-col space-y-3">
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="relative pb-5">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneNumberInput
                          value={field.value}
                          onChange={field.onChange}
                          disabled={false}
                          placeholder="+1 (555) 123-4567"
                        />
                      </FormControl>
                      <div className="absolute bottom-0 left-0">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative pb-5">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" type="email" {...field} />
                      </FormControl>
                      <div className="absolute bottom-0 left-0">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative pb-5">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••••" type="password" {...field} />
                        </FormControl>
                        <div className="absolute bottom-0 left-0">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="relative pb-5">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••••" type="password" {...field} />
                        </FormControl>
                        <div className="absolute bottom-0 left-0">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-3">
              <Button
                className="w-full bg-gradient-to-br from-[#A001FE] via-violet-600 to-gray-800 hover:opacity-95 cursor-pointer"
                type="submit"
              >
                                Continue
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
