import { z } from "zod";

export const loginIEmailSchema = z.object({
  emailOrPhone: z
    .string()
    .min(3, "Please enter a valid email address or phone number")
    .refine((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{9,15}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }, {
      message: "Please enter a valid email address or phone number",
    }),
});

export type loginIEmailFormData = z.infer<typeof loginIEmailSchema>;
