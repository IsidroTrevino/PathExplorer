'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SignUpStepOneData, SignUpStepTwoData, signUpStepTwoSchema } from '@/schemas/auth/signUpSchema';
import { useRegister } from '@/features/auth/register/useRegister';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const positions = [
  'Accenture Leadership (Level 1)',
  'Accenture Leadership (Level 2)',
  'Accenture Leadership (Level 3)',
  'Accenture Leadership (Level 4)',
  'Associate Director or Principal Director (Level 5)',
  'Senior Manager or Senior Principal (Level 6)',
  'Manager or Principal (Level 7)',
  'Associate Manager or Associate Principal (Level 8)',
  'Consultant, Team Lead, or Specialist (Level 9)',
  'Senior Analyst (Level 10)',
  'Analyst (Level 11)',
  'Associate (Level 12)',
  'New Associate or Assistant (Level 13)',
];

export default function AdditionalInfoPage() {
  const router = useRouter();
  const [stepOneData, setStepOneData] = useState<SignUpStepOneData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      location: '',
      capability: '',
      role: 'Developer',
    },
  });

  async function onSubmit(values: SignUpStepTwoData) {
    if (!stepOneData) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const completeData = {
        ...stepOneData,
        ...values,
        role: 'Developer',
      };

      const response = await register(completeData);

      if (response && response.success) {
        localStorage.removeItem('signUpStepOne');
        router.push('/user/basic-info');
      } else {
        setError(response?.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!stepOneData) return null;

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white overflow-hidden">
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
              Professional Information
          </p>
          <p className="text-gray-600 text-sm">
              Tell us about your experience as a Developer.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-500">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h2 className="text-xl font-medium mb-2">Location</h2>
              <Separator className="mb-3" />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where are you located?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City, Country (e.g., Monterrey, MX)"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-1">
              <h2 className="text-xl font-medium mb-2">Professional Information</h2>
              <Separator className="mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="capability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capability</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Cloud, Security, Frontend"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seniority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Years of experience"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-1">
              <h2 className="text-xl font-medium mb-2">Current Position</h2>
              <Separator className="mb-3" />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select your current level at Accenture</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your position" />
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

              {/* Hidden field for role that's always set to "Developer" */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <input type="hidden" {...field} value="Developer" />
                )}
              />
            </div>

            <div className="flex flex-col space-y-3 pt-4">
              <Button
                className="w-full bg-gradient-to-br from-[#A001FE] via-violet-600 to-gray-800 hover:opacity-95 cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                type="button"
                disabled={isSubmitting}
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
