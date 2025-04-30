import { z } from 'zod';

export const signUpStepOneBase = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .transform(value => value.trim())
    .refine((value) => value.length >= 2, {
      message: 'Name must contain at least 2 non-space characters',
    }),
  last_name_1: z.string()
    .min(1, 'Last name is required')
    .transform(value => value.trim()),
  last_name_2: z.string()
    .transform(value => value.trim())
    .optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone_number: z.string().min(10, 'Phone number is required'),
});

export const signUpStepOneSchema = signUpStepOneBase.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  },
);

export type SignUpStepOneData = z.infer<typeof signUpStepOneSchema>;

export const signUpStepTwoSchema = z.object({
  seniority: z.string().min(1, 'Seniority is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  capability: z.string().min(1, 'Capability is required'),
  role: z.string().min(1, 'Role is required'),
});

export type SignUpStepTwoData = z.infer<typeof signUpStepTwoSchema>;

export const completeSignUpSchema = signUpStepOneBase.merge(signUpStepTwoSchema).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  },
);

export type CompleteSignUpData = z.infer<typeof completeSignUpSchema>;
