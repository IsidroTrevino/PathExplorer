'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { UserInfoFormData } from '@/schemas/user/userInfoSchema';
import { positions, capabilities } from '@/constants/constants';

interface ProfessionalInfoSectionProps {
    form: UseFormReturn<UserInfoFormData>;
}

export function ProfessionalInfoSection({ form }: ProfessionalInfoSectionProps) {
  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="bg-white border-b pb-4">
        <CardTitle className="text-xl font-medium text-[#7500C0]">Professional Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div>
          <FormField
            control={form.control}
            name="capability"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Capability</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your capability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-80">
                    {capabilities.map((capability) => (
                      <SelectItem key={capability} value={capability}>
                        {capability}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Position</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-80">
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seniority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Years of Experience</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Years of experience" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Role</FormLabel>
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
      </CardContent>
    </Card>
  );
}
