"use client";

import { registerSchema } from "@/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", data);

      if (res.status === 200) {
        toast.success(res.data.message);
        router.push("/login");
      }
    } catch (err: any) {
      console.log(err);
      const message = err.response?.data?.message || "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full shadow-xl rounded-2xl border-green-100 animate-fade-in-down sm:max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-green-700">
            Create Your Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="form-name">
                      Full Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <UserIcon />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="form-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="John Doe"
                        autoComplete="off"
                        type="text"
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
              disabled={loading}
              type="submit"
              form="form-register"
              className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-md cursor-pointer"
            >
              Register
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
              Already have an account?{" "}
              <span
                className="text-green-600 cursor-pointer hover:underline"
                onClick={() => router.push("/login")}
              >
                Login
              </span>
            </p>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
