import z from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(5, "User name must be at least 5 characters.")
    .max(32, "User name must be at most 32 characters.")
    .regex(
      /^[a-zA-Z_]+$/,
      "User name can only contain letters, and underscores.",
    ),
  email: z
    .email("Please enter a valid email address.")
    .max(100, "Email must be at most 100 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(15, "Password must be at most 15 characters."),
});
