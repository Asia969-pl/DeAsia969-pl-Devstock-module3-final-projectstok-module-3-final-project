import { z } from "zod";

export const loginPaswordSchema = z.object({
    password: z.string().min(9, "Pasword is required"),
  });


  export type loginPaswordFormData = z.infer<typeof loginPaswordSchema>;