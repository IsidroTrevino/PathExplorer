'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/features/context/userContext';
import { useEditInfo } from '../hooks/useEditInfo';
import { userInfoSchema, UserInfoFormData } from '@/schemas/user/userInfoSchema';
import { PersonalInfoSection } from './PersonalInfoSection';
import { LocationInfoSection } from './LocationInfoSection';
import { ProfessionalInfoSection } from './ProfessionalInfoSection';
import { AssignmentInfoSection } from './AssignmentInfoSection';

export function BasicInfoForm() {
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
    mode: 'onBlur',
  });

  const { handleSubmit, formState, reset } = form;
  const { isDirty } = formState;

  const initialValues = useMemo(() => {
    if (!userDetails) return null;
    return {
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
    };
  }, [userDetails]);

  useEffect(() => {
    if (initialValues && !isFormReady) {
      reset(initialValues);
      setIsFormReady(true);
    }
  }, [initialValues, reset, isFormReady]);

  useEffect(() => {
    if (isFormReady) {
      setFormModified(isDirty);
    }
  }, [isDirty, isFormReady]);

  const onSubmit = useCallback(async (data: UserInfoFormData) => {
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
  }, [updateUserInfo, error]);

  if (!isFormReady) {
    return (
      <div className="flex justify-center items-center bg-white rounded-lg shadow-sm p-12 my-10">
        <Loader2 className="h-8 w-8 animate-spin text-[#7500C0]" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div>
          <PersonalInfoSection form={form} userDetails={userDetails} />
          <div className="mt-6">
            <LocationInfoSection form={form} />
          </div>
          <div className="mt-6">
            <ProfessionalInfoSection form={form} />
          </div>
          <div className="mt-6">
            <AssignmentInfoSection />
          </div>
        </div>

        {formModified && (
          <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <div className="max-w-5xl w-11/12 bg-white p-4 shadow-lg rounded-lg border pointer-events-auto">
              <div className="flex justify-end">
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
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
