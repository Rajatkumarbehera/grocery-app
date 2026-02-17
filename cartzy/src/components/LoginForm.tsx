"use client";

import { loginSchema } from "@/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import google from "../../public/google.png";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await signIn("credentials", { ...data, redirect: false });
      console.log(res);

      if (res?.error) {
        toast.error("Invalid email or password.");
        return;
      }
      router.push("/");
    } catch (err: any) {
      console.log(err);
      const message = "Something went wrong.";
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full shadow-xl rounded-2xl border-green-100 animate-fade-in-down sm:max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-green-700">
            Welcome Back 👋
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Login to continue shopping with{" "}
            <span className="text-green-700 font-semibold">Cartzy</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="form-email">
                      Email Address <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <MailIcon />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="form-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="example@gmail.com"
                        autoComplete="off"
                        type="email"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-xs"
                      />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="form-password">
                      Password <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <LockIcon />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="form-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="At least 8 characters"
                        autoComplete="off"
                        type={showPassword ? "text" : "password"}
                      />
                      <InputGroupAddon
                        align="inline-end"
                        className="cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOffIcon onClick={() => setShowPassword(false)} />
                        ) : (
                          <EyeIcon onClick={() => setShowPassword(true)} />
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-xs"
                      />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field>
            <Button
              type="submit"
              form="form-login"
              className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-md cursor-pointer"
            >
              Login
            </Button>
            <div className="flex items-center justify-center gap-2 text-sm">
              Or continue with
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn("google", { redirectTo: "/" })}
                className="p-3 cursor-pointer"
              >
                <Image src={google} alt="google" width={16} height={16} />
              </Button>
            </div>
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <span
                className="text-green-600 cursor-pointer hover:underline"
                onClick={() => router.push("/register")}
              >
                Register
              </span>
            </p>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
