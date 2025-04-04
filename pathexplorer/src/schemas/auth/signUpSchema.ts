import { z } from 'zod';

export const signUpStepOneBase = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .transform(value => value.trim())
    .refine((value) => value.length >= 2, {
      message: 'Name must contain at least 2 non-space characters',
    }),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
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
