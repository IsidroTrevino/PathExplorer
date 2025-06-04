// app/auth/SignUp/components/StepContactInfo.tsx
'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SignUpStepOneData } from '@/schemas/auth/signUpSchema';
import { PhoneNumberInput } from '@/components/phoneInput';

interface StepContactInfoProps {
    form: UseFormReturn<SignUpStepOneData>;
    onNext: () => void;
    onBack: () => void;
}

export default function StepContactInfo({ form, onNext, onBack }: StepContactInfoProps) {
  const { formState } = form;
  const isStepValid = formState.dirtyFields.email &&
        !formState.errors.email &&
        formState.dirtyFields.password &&
        !formState.errors.password &&
        formState.dirtyFields.confirmPassword &&
        !formState.errors.confirmPassword &&
        formState.dirtyFields.phone_number &&
        !formState.errors.phone_number;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <h2 className="text-xl font-medium mb-4">Contact & Security</h2>
      <Separator className="mb-6" />

      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneNumberInput
                    placeholder="Enter your phone number"
                    {...field}
                  />
                </FormControl>
                <div className="h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your.email@accenture.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <div className="h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="min-h-[85px]">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Create a strong password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="min-h-[85px]">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isStepValid}
          className={`${isStepValid ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
