import z from "zod";

export const onboardingSchema = z.object({
  role: z.enum(["admin", "customer", "delivery_partner", "restaurant"]),
  mobile: z
    .string()
    .length(10, "Mobile number must be exactly 10 digits.")
    .regex(/^[0-9]+$/, "Mobile number must contain only digits."),
});
