'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SignUpStepOneData, SignUpStepTwoData, signUpStepTwoSchema } from '@/schemas/auth/signUpSchema';
import { useRegister } from '@/features/auth/register/useRegister';

const positions = [
  'Software Engineer',
  'Product Manager',
  'UX Designer',
  'Data Scientist',
  'Business Analyst',
  'Solutions Architect',
  'DevOps Engineer',
  'QA Engineer',
];

export default function AdditionalInfoPage() {
  const router = useRouter();
  const [stepOneData, setStepOneData] = useState<SignUpStepOneData | null>(null);
  const { register } = useRegister();

  useEffect(() => {
    const savedData = localStorage.getItem('signUpStepOne');
    if (!savedData) {
      router.push('/auth/SignUp');
      return;
    }

    setStepOneData(JSON.parse(savedData));
  }, [router]);

  const form = useForm<SignUpStepTwoData>({
    resolver: zodResolver(signUpStepTwoSchema),
    defaultValues: {
      seniority: '',
      position: '',
    },
  });

  async function onSubmit(values: SignUpStepTwoData) {
    if (!stepOneData) return;

    const completeData = {
      ...stepOneData,
      ...values,
    };

    console.log(completeData);

    const response = await register(completeData);

    if (response && response.success) {
      localStorage.removeItem('signUpStepOne');
      router.push('/user/basic-info');
    } else {
      console.error(response?.message || 'Registration failed');
    }
  }

  if (!stepOneData) return null;

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
                        Just some more information...
          </p>
          <p className="text-gray-600 text-sm">
                        Tell us about your role and experience.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col space-y-6">
            <div className="flex flex-col space-y-3">
              <FormField
                control={form.control}
                name="seniority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Years of experience" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                                Complete Registration
              </Button>

              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => router.back()}
              >
                                Go Back
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
