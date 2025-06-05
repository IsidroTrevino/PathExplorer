'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { UserInfoFormData } from '@/schemas/user/userInfoSchema';

interface LocationInfoSectionProps {
    form: UseFormReturn<UserInfoFormData>;
}

export function LocationInfoSection({ form }: LocationInfoSectionProps) {
  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="bg-white border-b pb-4">
        <CardTitle className="text-xl font-medium text-[#7500C0]">Location Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Location</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="City, Country (e.g., Monterrey, MX)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
