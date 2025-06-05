'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneNumberInput } from '@/components/phoneInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { UserInfoFormData } from '@/schemas/user/userInfoSchema';

interface PersonalInfoSectionProps {
    form: UseFormReturn<UserInfoFormData>;
}

export function PersonalInfoSection({ form }: PersonalInfoSectionProps) {
  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="bg-white border-b pb-4">
        <CardTitle className="text-xl font-medium text-[#7500C0]">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">First Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">First Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="First last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="last_name_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Second Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Second last name (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Personal email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                  <FormControl>
                    <PhoneNumberInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="+52 (555) 123-4567"
                      defaultCountry="MX"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
