import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    name: z.string().min(3, "name 3 letters min"),
    number: z
      .string()
      .min(10, "."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    passwordConfirmed: z.string(),

    country: z.string(),

    agreements: z.boolean().refine(val => val === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmed, {
    message: "Passwords do not match",
    path: ["passwordConfirmed"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
