import { z } from 'zod';

export const userInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  last_name_1: z.string().min(1, 'First last name is required'),
  last_name_2: z.string().optional(),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  location: z.string().min(1, 'Location is required'),
  capability: z.string().min(1, 'Capability is required'),
  position: z.string().min(1, 'Position is required'),
  seniority: z.coerce.number().min(0, 'Seniority must be a positive number'),
  role: z.string(),
});

export type UserInfoFormData = z.infer<typeof userInfoSchema>;
