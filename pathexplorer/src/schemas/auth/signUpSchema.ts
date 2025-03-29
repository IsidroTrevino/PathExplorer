import { z } from 'zod';

// Step One: Define a base object without refinement.
export const signUpStepOneBase = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
});

// Now add the refinement to check that the passwords match.
export const signUpStepOneSchema = signUpStepOneBase.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  },
);

// Export the type for step one.
export type SignUpStepOneData = z.infer<typeof signUpStepOneSchema>;

// Step Two: Define the schema for additional info.
export const signUpStepTwoSchema = z.object({
  seniority: z.string().min(1, 'Seniority is required'),
  position: z.string().min(1, 'Position is required'),
});

// Export the type for step two.
export type SignUpStepTwoData = z.infer<typeof signUpStepTwoSchema>;

// (Optional) If you need a complete sign-up schema that merges both steps,
// merge the base objects first, then add the refinement.
export const completeSignUpSchema = signUpStepOneBase.merge(signUpStepTwoSchema).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  },
);

// Export the type for complete sign up.
export type CompleteSignUpData = z.infer<typeof completeSignUpSchema>;
