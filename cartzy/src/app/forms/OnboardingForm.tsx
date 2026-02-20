"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { roleLists } from "@/constants/roles";
import { cn } from "@/lib/utils";
import { onboardingSchema } from "@/schemas/onboarding.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { PhoneIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface OnboardingFormProps {
  adminExists: boolean;
}

export default function OnboardingForm({ adminExists }: OnboardingFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const roles = adminExists
    ? roleLists.filter((role) => role.id !== "admin")
    : roleLists;

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      role: "customer",
      mobile: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
    setLoading(true);
    try {
      await axios.post("/api/user/onboarding", data);
      await update({ role: data.role });
      router.push("/");
    } catch (err: any) {
      console.log(err);
      const message =
        err.response?.data?.message || "Failed to complete onboarding.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">
        Are you a <span className="text-green-500">Customer</span> or{" "}
        <span className="text-green-500">Delivery Partner</span>?
      </h1>

      <form
        id="form-onboarding"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <FieldGroup>
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <RadioGroup
                  className="grid grid-cols-2 gap-6"
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  {roles?.map((role) => {
                    return (
                      <FieldLabel key={role.id} htmlFor={`form-${role.id}`}>
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                          className={cn(
                            "transition-all duration-200 rounded-md cursor-pointer",
                            field.value === role.id
                              ? "bg-green-500 border-green-500 "
                              : "bg-white",
                          )}
                        >
                          <FieldContent>
                            <FieldTitle
                              className={
                                field.value === role.id ? "text-white" : ""
                              }
                            >
                              <role.icon />
                            </FieldTitle>
                            <FieldDescription
                              className={
                                field.value === role.id ? "text-white" : ""
                              }
                            >
                              {role.description}
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            value={role.id}
                            id={`form-${role.id}`}
                            aria-invalid={fieldState.invalid}
                            className={cn(
                              field.value === role.id &&
                                "border-white text-white [&_svg]:fill-white",
                            )}
                          />
                        </Field>
                      </FieldLabel>
                    );
                  })}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-xs" />
                )}
              </Field>
            )}
          />
          <Controller
            name="mobile"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-mobile">
                  Mobile <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <PhoneIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="form-mobile"
                    aria-invalid={fieldState.invalid}
                    maxLength={10}
                    placeholder="Enter your 10 digits mobile number"
                    autoComplete="off"
                    type="tel"
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-xs" />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Button
          disabled={loading}
          type="submit"
          form="form-onboarding"
          className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-md cursor-pointer"
        >
          Continue
        </Button>
      </form>
    </div>
  );
}
