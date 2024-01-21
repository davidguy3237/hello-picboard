import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email is requried" }),
  username: z.string().min(3, { message: "Minimum 3 characters required" }),
  password: z.string().min(8, { message: "Minimum 8 characters required" }),
});
