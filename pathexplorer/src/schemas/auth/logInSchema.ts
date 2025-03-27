import * as z from 'zod';

export const logInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export type LogInFormData = z.infer<typeof logInSchema>;
