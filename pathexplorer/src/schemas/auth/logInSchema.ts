import * as z from 'zod';

export const logInSchema = z.object({
  username: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string(),
});

export type LogInFormData = z.infer<typeof logInSchema>;
