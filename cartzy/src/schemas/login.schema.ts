import z from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .max(100, "Email must be at most 100 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(15, "Password must be at most 15 characters."),
});
