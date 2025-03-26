"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { BsMicrosoft } from "react-icons/bs";
import { logInSchema, LogInFormData } from "@/schemas/auth/logInSchema";


export default function LogInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormData>({
    resolver: zodResolver(logInSchema),
  });

  const onSubmit = (data: LogInFormData) => {
    console.log("Form Data:", data);
    // TODO: Integrate API
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-purple-200 via-white to-transparent pointer-events-none z-0" />
      <div className="z-10 flex flex-col items-center space-y-10">
        <Image
          src="/accenture/Acc_Logo_Black_Purple_RGB.png"
          alt="logo-accenture"
          width={263}
          height={69}
        />

        <div className="flex flex-col items-center text-center">
          <p className="text-black text-lg font-semibold">Log in to your account</p>
          <p className="text-gray-600 text-sm">
            Enter your email and password below to log in
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 w-80">
          <div>
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Input type="password" placeholder="Password" />
          </div>

          <Button
            className="w-full bg-gradient-to-br from-[#A001FE] via-violet-600 to-gray-800 hover:opacity-95 cursor-pointer"
            type="submit"
          >
            Log In with Email
          </Button>

          <div className="flex items-center space-x-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              OR CONTINUE WITH
            </span>
            <Separator className="flex-1" />
          </div>

          <Button
            className="w-full bg-black text-white hover:opacity-95 cursor-pointer gap-2"
            type="button"
          >
            <BsMicrosoft size={18} />
            <span>Microsoft</span>
          </Button>

          <div>
            <p className="text-muted-foreground text-sm text-center pt-2 mx-10">
              By clicking continue, you agree to our{" "}
              <span className="underline cursor-pointer">
                Terms of Service and Privacy Policy
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
