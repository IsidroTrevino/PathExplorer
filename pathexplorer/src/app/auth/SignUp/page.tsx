'use client';

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BsMicrosoft } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { signUpSchema, SignUpFormData } from "@/schemas/auth/signUpSchema";

export default function SignUpPage() {
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: SignUpFormData) {
    console.log(values);
    //! TODO - Integrate API
  }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-[420px] flex flex-col items-center">
                <Image
                    src={'/accenture/Acc_Logo_Black_Purple_RGB.png'}
                    alt={'accenture logo'}
                    width={200}
                    height={200}
                />
                <h1 className="text-2xl font-semibold mt-6">
                    Create an account
                </h1>
                <p className="text-muted-foreground text-sm mt-2 mb-6">
                    Enter the required information to create an account.
                </p>
                <div className="w-full">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                            <div className="space-y-4 w-full">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Full Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="email" placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="password" placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="password" placeholder="Confirm Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    className="w-full bg-gradient-to-br from-[#A001FE] via-violet-600 to-gray-800 hover:opacity-95 cursor-pointer"
                                    type="submit"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="flex items-center gap-4 my-4">
                        <Separator className="flex-1" />
                        <span className="text-muted-foreground text-xs">OR CONTINUE WITH</span>
                        <Separator className="flex-1" />
                    </div>
                    <Button
                        className="w-full bg-black hover:opacity-95 cursor-pointer"
                        type="button"
                    >
                        <BsMicrosoft /> <span>Microsoft</span>
                    </Button>
                    <div className="flex justify-end pt-2">
                        <Button className="cursor-pointer text-[#A001FE] p-0" variant="link" onClick={() => router.push('/auth/LogIn')}>Already have an account? Log In</Button>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm text-center pt-2 mx-10">
                            By signing up, you agree to our <span className="underline cursor-pointer">Terms of Service and Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
