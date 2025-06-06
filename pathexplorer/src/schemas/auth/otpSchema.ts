import { z } from 'zod';

export const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

export type OtpFormData = z.infer<typeof otpSchema>;
