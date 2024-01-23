import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email is requried" }),
  username: z.string().min(3, { message: "Minimum 3 characters required" }),
  password: z.string().min(8, { message: "Minimum 8 characters required" }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, { message: "Minimum 8 characters required" }),
});
