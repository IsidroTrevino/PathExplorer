'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SignUpStepTwoData } from '@/schemas/auth/signUpSchema';
import { positions, capabilities } from '@/constants/constants';

interface StepProfessionalInfoProps {
    form: UseFormReturn<SignUpStepTwoData>;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export default function StepProfessionalInfo({
  form,
  onBack,
  onSubmit,
  isSubmitting,
}: StepProfessionalInfoProps) {
  const { formState } = form;
  const isStepValid = formState.dirtyFields.location &&
        !formState.errors.location &&
        formState.dirtyFields.capability &&
        !formState.errors.capability &&
        formState.dirtyFields.position &&
        !formState.errors.position &&
        formState.dirtyFields.seniority &&
        !formState.errors.seniority;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <h2 className="text-xl font-medium mb-4">Professional Information</h2>
      <Separator className="mb-6" />

      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>Where are you located?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., Mexico City, Mexico"
                    disabled={isSubmitting}
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
              name="capability"
              render={({ field }) => (
                <FormItem className="min-h-[85px]">
                  <FormLabel>Capability</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seniority"
              render={({ field }) => (
                <FormItem className="min-h-[85px]">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., 3"
                      type="number"
                      disabled={isSubmitting}
                      {...field}
                      value={field.value === undefined || field.value === null ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>Current level at Accenture</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current level" />
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
                <div className="h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <input type="hidden" {...field} value="Developer" />
            )}
          />
        </div>
      </Form>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !isStepValid}
          className={`${isStepValid && !isSubmitting ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
            </>
          ) : (
            <>Complete Registration</>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
