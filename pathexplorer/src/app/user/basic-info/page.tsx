'use client';

import { Input } from '@/components/ui/input';
import { useUser } from '@/features/context/userContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormMessage, FormLabel } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormItem } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEditInfo } from '@/features/user/useEditInfo';
import { toast } from 'sonner';
import { userInfoSchema, UserInfoFormData } from '@/schemas/user/userInfoSchema';
import { PhoneNumberInput } from '@/components/GlobalComponents/phoneInput';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/GlobalComponents/pageHeader';

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

const capabilities = [
  'DevOps',
  'Experience Design',
  'Business Analysis',
  'Data & Analytics',
  'MS Business Apps',
  'Cloud',
  'MS Platform',
  'Program Project Management',
  'Workday',
  'Quality Engineering',
  'SAP',
  'MS Cloud Security',
  'MS Data & Augmented insights',
  'Capital Markets Processes',
  'Hostcentric Platform',
  'Industry Portfolio Delivery',
  'Solutions',
  'ServiceNow',
  'Content & Commerce Management',
  'P&PES',
  'Back End Engineering',
  'IO',
  'Security',
  'Security- Mnemo',
  'Oracle',
  'Mobility Services',
  'Agile',
  'Front End Engineering',
];

export default function BasicInfoPage() {
  const [formModified, setFormModified] = useState(false);
  const { userDetails } = useUser();
  const { updateUserInfo, isLoading, error } = useEditInfo();
  const [isFormReady, setIsFormReady] = useState(false);

  const form = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: '',
      email: '',
      last_name_1: '',
      last_name_2: '',
      phone_number: '',
      location: '',
      capability: '',
      position: '',
      seniority: 0,
      role: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, watch, reset, formState: { isDirty } } = form;
  const watchedValues = watch();

  useEffect(() => {
    if (userDetails) {
      reset({
        name: userDetails.name || '',
        email: userDetails.email || '',
        last_name_1: userDetails.last_name_1 || '',
        last_name_2: userDetails.last_name_2 || '',
        phone_number: userDetails.phone_number || '',
        location: userDetails.location || '',
        capability: userDetails.capability || '',
        position: userDetails.position || '',
        seniority: userDetails.seniority || 0,
        role: userDetails.role || '',
      });
      setIsFormReady(true);
    }
  }, [userDetails, reset]);

  useEffect(() => {
    if (!userDetails || !isFormReady) return;

    const isModified =
        watchedValues.name !== userDetails.name ||
        watchedValues.email !== userDetails.email ||
        watchedValues.last_name_1 !== userDetails.last_name_1 ||
        watchedValues.last_name_2 !== userDetails.last_name_2 ||
        watchedValues.phone_number !== userDetails.phone_number ||
        watchedValues.location !== userDetails.location ||
        watchedValues.capability !== userDetails.capability ||
        watchedValues.position !== userDetails.position ||
        watchedValues.seniority !== userDetails.seniority;

    setFormModified(isModified && isDirty);
  }, [watchedValues, userDetails, isDirty, isFormReady]);

  const onSubmit = async (data: UserInfoFormData) => {
    const success = await updateUserInfo({
      name: data.name,
      email: data.email,
      last_name_1: data.last_name_1,
      last_name_2: data.last_name_2 || '',
      phone_number: data.phone_number,
      location: data.location,
      capability: data.capability,
      position: data.position,
      seniority: Number(data.seniority),
      role: data.role,
    });

    if (success) {
      toast.success('Your information has been updated successfully');
      setFormModified(false);
    } else if (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex-1 p-8 max-w-5xl mx-16">
        <PageHeader title={`Welcome back, ${userDetails?.name} ${userDetails?.last_name_1} ${userDetails?.last_name_2}!`} subtitle={'Fill in and verify your personal information, you can modify it whenever you want.'}/>

        {!isFormReady ? (
          <div className="flex justify-center my-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#7500C0]" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h2 className="text-xl font-medium mb-2 pt-4">Personal Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">First Name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name_1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">First Last Name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="First last name" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="last_name_2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Second Last Name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Second last name (optional)" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Email</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Personal email" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Phone Number</FormLabel>
                        <FormControl>
                          <PhoneNumberInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="+52 (555) 123-4567"
                            defaultCountry="MX"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-2">Location Information</h2>
                <Separator className="mb-4" />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Location</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="City, Country (e.g., Monterrey, MX)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h2 className="text-xl font-medium mb-2">Professional Information</h2>
                <Separator className="mb-4" />
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="capability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Capability</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select your capability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {capabilities.map((capability) => (
                              <SelectItem key={capability} value={capability}>
                                {capability}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Position</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
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
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seniority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Years of Experience</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Years of experience" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Role</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Department/role"
                            {...field}
                            readOnly={true}
                            className="bg-gray-50 cursor-not-allowed"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-2">Assignment Information</h2>
                <Separator className="mb-4" />
                <div className="flex items-center gap-4">
                  <div className="w-1/3">
                    <p className="text-base font-medium">Assignment percentage</p>
                  </div>
                  <div className="w-2/3 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div className="bg-[#A055F5] text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: '38%' }}> 38%</div>
                  </div>
                </div>
              </div>

              {formModified && (
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-[#7500C0] text-white hover:bg-[#6200a0]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                      </>
                    ) : (
                      'Save changes'
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
