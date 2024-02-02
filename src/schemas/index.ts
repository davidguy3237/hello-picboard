import { UserRole } from "@prisma/client";
import * as z from "zod";

export const settingsSchema = z
  .object({
    name: z.optional(
      z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9_]*$"), {
          message: "Invalid characters used",
        })
        .min(3, { message: "Username must be at least 3 characters" })
        .max(20, { message: "Username must be 20 characters or fewer" }),
    ),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(
      z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(191, { message: "Password must be 191 characters or fewer" }),
    ),
    newPassword: z.optional(
      z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(191, { message: "Password must be 191 characters or fewer" }),
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }).max(191),
  code: z.optional(z.string()),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "Email is required" }),
    username: z
      .string()
      .regex(new RegExp("^[a-zA-Z0-9_]*$"), {
        message: "Invalid characters used",
      })
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be 20 characters or fewer" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(191, { message: "Password must be 191 characters or fewer" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(191, { message: "Password must be 191 characters or fewer" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(191, { message: "Password must be 191 characters or fewer" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(191, { message: "Password must be 191 characters or fewer" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
