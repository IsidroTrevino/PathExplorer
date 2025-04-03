'use client';

import React, { use } from 'react';
import { SideBar, UserRole } from '@/components/GlobalComponents/SlideBar';
import { Input } from '@/components/ui/input';
import { useUser } from '@/features/context/userContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@/components/ui/form';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormControl } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';

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

interface userData {
  name: string;
  email: string;
  position: string;
  seniority: string;
  role: string;
}

export default function BasicInfoPage() {
  const form = useForm<userData>({
    defaultValues: {
      name: '',
      email: '',
      position: '',
      seniority: '',
      role: '',
    },
  });

  const { register, setValue, watch } = form;

  const { userDetails } = useUser();

  useEffect(() => {
    if (userDetails) {
      setValue('name', userDetails.name);
      setValue('email', userDetails.email);
      setValue('position', userDetails.position);
      setValue('seniority', userDetails.seniority.toString());
      setValue('role', userDetails.rol);
    }
  }, [userDetails]);

  const formValues = watch();

  return (
    <div className="flex min-h-screen">
      <SideBar role={UserRole.EMPLOYEE} />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome back, {userDetails?.name}!</h1>
        <p>Fill in and verify your personal information, you can modify it whenever you want.</p>

        <Form {...form}>
          <div className="pt-6 pr-96 flex-col space-y-6">

            <div className="flex items-center gap-40">
              <h1 className="text-l font-semibold w-[300px]">Name</h1>
              <Input type="text" placeholder="Full name" {...register('name')}></Input>
            </div>

            <div className="flex items-center gap-40">
              <h1 className="text-l font-semibold w-[300px]">E-mail</h1>
              <Input type="text" placeholder="Personal mail" {...register('email')}></Input>
            </div>

            <div className="flex items-center gap-8">
              <h1 className="text-l font-semibold  w-[300px]">Position</h1>
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <div className="flex items-center">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value} 
                      {...register('position')}
                    >
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
                  </div>
                )}
              />
            </div>

            <div className="flex items-center gap-40">
              <h1 className="text-l font-semibold  w-[300px]">Seniority</h1>
              <Input type="text" placeholder="Seniority" {...register("seniority")}></Input>
            </div>

            <div className="flex items-center gap-40">
              <h1 className="text-l font-semibold  w-[300px]">Department/Role</h1>
              <Input type="text" placeholder="Department/role" {...register("role")}></Input>
            </div>

            <div className="flex items-center gap-40">
              <h1 className="text-l font-bold  w-[300px]">Assignment percentage</h1>
              <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div className="bg-[#A055F5] text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: '38%' }}> 38%</div>
              </div>
            </div>

          </div>

        </Form>
      </div>
    </div>
  );
};

