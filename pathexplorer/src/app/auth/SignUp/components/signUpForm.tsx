// app/auth/SignUp/components/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { SignUpStepOneData, SignUpStepTwoData, signUpStepOneSchema, signUpStepTwoSchema } from '@/schemas/auth/signUpSchema';
import { useRegister } from '../hooks/useRegister';
import { signUpSteps } from '@/constants/constants';

import ProgressSteps from './ProgressSteps';
import StepPersonalInfo from './StepPersonalInfo';
import StepContactInfo from './StepContactInfo';
import StepProfessionalInfo from './StepProfessionalInfo';

export default function SignUpForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useRegister();

  // Form for steps 1 and 2
  const formOne = useForm<SignUpStepOneData>({
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
    mode: 'onChange',
  });

  // Form for step 3
  const formTwo = useForm<SignUpStepTwoData>({
    resolver: zodResolver(signUpStepTwoSchema),
    defaultValues: {
      seniority: undefined,
      position: '',
      location: '',
      capability: '',
      role: 'Developer',
    },
    mode: 'onChange',
  });

  async function nextStep() {
    if (currentStep === 0) {
      const isValid = await formOne.trigger(['name', 'last_name_1', 'last_name_2']);
      if (isValid) setCurrentStep(1);
    } else if (currentStep === 1) {
      const isValid = await formOne.trigger(['email', 'password', 'confirmPassword', 'phone_number']);
      if (isValid) setCurrentStep(2);
    }
  }

  function prevStep() {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }

  async function onSubmit() {
    const isFormOneValid = await formOne.trigger();
    const isFormTwoValid = await formTwo.trigger();

    if (!isFormOneValid || !isFormTwoValid) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const completeData = {
        ...formOne.getValues(),
        ...formTwo.getValues(),
      };

      const response = await register(completeData);

      if (response && response.success) {
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

  return (
    <div className="z-10 w-full max-w-2xl px-6 py-10 my-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="mb-2">
          <Image
            src={'/accenture/Acc_Logo_Black_Purple_RGB.png'}
            alt={'accenture logo'}
            width={200}
            height={52}
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-6">Create Your Account</h1>
        <p className="text-gray-600 mt-2">Join the Accenture developer community</p>
      </div>

      {/* Progress Steps */}
      <ProgressSteps steps={signUpSteps} currentStep={currentStep} />

      <div className="h-12">
        {error && (
          <Alert variant="destructive" className="border-red-500 w-full mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="w-full bg-white rounded-lg shadow-sm border p-6">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <StepPersonalInfo key="step1" form={formOne} onNext={nextStep} />
          )}

          {currentStep === 1 && (
            <StepContactInfo key="step2" form={formOne} onNext={nextStep} onBack={prevStep} />
          )}

          {currentStep === 2 && (
            <StepProfessionalInfo
              key="step3"
              form={formTwo}
              onBack={prevStep}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="w-full text-center mt-6">
        <Button
          variant="link"
          className="text-purple-600"
          onClick={() => router.push('/auth/LogIn')}
        >
                    Already have an account? Log In
        </Button>
      </div>
    </div>
  );
}
