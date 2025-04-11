'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useMemo } from 'react';

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerifyOTPPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);
  const ref5 = useRef<HTMLInputElement>(null);
  const ref6 = useRef<HTMLInputElement>(null);

  const inputRefs = useMemo(() => [ref1, ref2, ref3, ref4, ref5, ref6], []);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      router.push('/auth/forgot-password');
      return;
    }
    setEmail(storedEmail);

    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [router, inputRefs]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtpValues = [...otpValues];

    if (value.length > 1) {
      const pastedChars = value.split('').slice(0, 6);
      const updatedValues = [...otpValues];

      pastedChars.forEach((char, idx) => {
        if (idx + index < 6) {
          updatedValues[idx + index] = char;
        }
      });

      setOtpValues(updatedValues);

      setValue('otp', updatedValues.join(''), { shouldValidate: true });

      const nextIndex = Math.min(index + pastedChars.length, 5);
      inputRefs[nextIndex].current?.focus();
      return;
    }

    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    setValue('otp', newOtpValues.join(''), { shouldValidate: true });
    clearErrors('otp');

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    sessionStorage.setItem('resetOTP', data.otp);
    router.push('/auth/reset-password');
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-purple-200 via-white to-transparent pointer-events-none z-0" />
      <div className="z-10 w-full max-w-sm px-6 flex flex-col items-center space-y-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <Image
              src="/accenture/Acc_Logo_Black_Purple_RGB.png"
              alt="logo-accenture"
              width={263}
              height={69}
            />
          </div>
          <p className="text-black text-lg font-semibold pt-4">
              Verify your email
          </p>
          <p className="text-gray-600 text-sm">
              Enter the verification code sent to{' '}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col space-y-6"
        >
          <div className="flex flex-col space-y-3">
            <div className="flex justify-center gap-2">
              {otpValues.map((value, index) => (
                <Input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={6} // Allow paste of full OTP
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1 text-center">
                {errors.otp.message}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              className="w-full bg-gradient-to-br from-[#A001FE] via-violet-600 to-gray-800 hover:opacity-95 cursor-pointer"
              type="submit"
            >
                Continue
            </Button>
          </div>
        </form>

        <div className="w-full">
          <div className="flex flex-col justify-center">
            <Button
              className="cursor-pointer text-[#A001FE] p-0"
              variant={'link'}
              onClick={() => router.push('/auth/forgot-password')}
            >
                Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
