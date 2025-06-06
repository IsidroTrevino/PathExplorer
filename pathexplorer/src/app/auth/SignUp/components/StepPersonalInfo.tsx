'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SignUpStepOneData } from '@/schemas/auth/signUpSchema';
import MicrosoftColorLogo from '@/components/microsoftLogo';

interface StepPersonalInfoProps {
    form: UseFormReturn<SignUpStepOneData>;
    onNext: () => void;
}

export default function StepPersonalInfo({ form, onNext }: StepPersonalInfoProps) {
  const { formState } = form;
  const isStepValid = formState.dirtyFields.name &&
        !formState.errors.name &&
        formState.dirtyFields.last_name_1 &&
        !formState.errors.last_name_1 &&
        formState.dirtyFields.last_name_2 &&
        !formState.errors.last_name_2;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <h2 className="text-xl font-medium mb-4">Personal Information</h2>
      <Separator className="mb-6" />

      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
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
            name="last_name_1"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>First Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your paternal surname"
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
            name="last_name_2"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>Second Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your maternal surname"
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
      </Form>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={onNext}
          disabled={!isStepValid}
          className={`${isStepValid ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="mt-6">
        <div className="flex items-center space-x-2 w-full">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">OR</span>
          <Separator className="flex-1" />
        </div>

        <Button className="w-full mt-4 bg-white text-black hover:bg-gray-50 border border-gray-300 gap-3" type="button">
          <MicrosoftColorLogo /> <span>Sign up with Microsoft</span>
        </Button>
      </div>
    </motion.div>
  );
}
