import * as z from 'zod';

export const userInfoSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must have at least 2 characters' })
    .refine(val => !val.startsWith(' '), {
      message: 'Name cannot start with a space',
    })
    .refine(val => !/\s{2,}/.test(val), {
      message: 'Name cannot contain consecutive spaces',
    }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  position: z.string()
    .min(1, { message: 'Please select a position' }),
  seniority: z.string()
    .refine(val => /^\d+$/.test(val), {
      message: 'Seniority must contain only numbers',
    }),
  role: z.string(),
});

export type UserInfoFormData = z.infer<typeof userInfoSchema>;
