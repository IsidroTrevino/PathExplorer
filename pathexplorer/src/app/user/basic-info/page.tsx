'use client';

import { SideBar, UserRole } from '@/components/GlobalComponents/SlideBar';
import { Input } from '@/components/ui/input';
import { useUser } from '@/features/context/userContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormMessage } from '@/components/ui/form';
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
      position: '',
      seniority: '',
      role: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, watch, reset, formState: { isDirty } } = form;
  const watchedValues = watch();

  useEffect(() => {
    if (userDetails) {
      reset({
        name: userDetails.name,
        email: userDetails.email,
        position: userDetails.position,
        seniority: userDetails.seniority.toString(),
        role: userDetails.rol,
      });
      setIsFormReady(true);
    }
  }, [userDetails, reset]);

  useEffect(() => {
    if (!userDetails || !isFormReady) return;

    const isModified =
        watchedValues.name !== userDetails.name ||
        watchedValues.email !== userDetails.email ||
        watchedValues.position !== userDetails.position ||
        watchedValues.seniority !== userDetails.seniority.toString();

    setFormModified(isModified && isDirty);
  }, [watchedValues, userDetails, isDirty, isFormReady]);

  const onSubmit = async (data: UserInfoFormData) => {
    const success = await updateUserInfo({
      name: data.name,
      email: data.email,
      position: data.position,
      seniority: parseInt(data.seniority),
    });

    if (success) {
      toast.success('Your information has been updated successfully');
      setFormModified(false);
    } else if (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideBar role={UserRole.EMPLOYEE} />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome back, {userDetails?.name}!</h1>
        <p>Fill in and verify your personal information, you can modify it whenever you want.</p>

        {!isFormReady ? (
          <div className="flex justify-center my-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#7500C0]" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="pt-6 pr-96 flex-col space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-40">
                      <h1 className="text-l font-semibold w-[300px]">Name</h1>
                      <div className="w-full">
                        <FormControl>
                          <Input type="text" placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-40">
                      <h1 className="text-l font-semibold w-[300px]">E-mail</h1>
                      <div className="w-full">
                        <FormControl>
                          <Input type="text" placeholder="Personal mail" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-40">
                      <h1 className="text-l font-semibold w-[300px]">Position</h1>
                      <div className="w-full">
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
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seniority"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-40">
                      <h1 className="text-l font-semibold w-[300px]">Seniority</h1>
                      <div className="w-full">
                        <FormControl>
                          <Input type="text" placeholder="Seniority" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-40">
                      <h1 className="text-l font-semibold w-[300px]">Department/Role</h1>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Department/role"
                          {...field}
                          readOnly={true}
                          className="bg-gray-50 cursor-not-allowed"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-40">
                <h1 className="text-l font-bold w-[300px]">Assignment percentage</h1>
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div className="bg-[#A055F5] text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: '38%' }}> 38%</div>
                </div>
              </div>

              {formModified && (
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#7500C0' }}
                    className="text-white"
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
