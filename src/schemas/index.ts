import { isValidImageFile } from "@/lib/validate-magic-number";
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
    email: z.optional(z.string().email()),
    password: z.optional(
      z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(256, { message: "Password is too long" }),
    ),
    newPassword: z.optional(
      z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(256, { message: "Password is too long" }),
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
  password: z.string().min(1, { message: "Password is required" }).max(257),
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
      .max(256, { message: "Password is too long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(256, { message: "Password is too long" }),
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
      .max(256, { message: "Password is too long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(256, { message: "Password is too long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(256, { message: "Password is too long" }),
    confirmNewPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(256, { message: "Password is too long" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UploadSchema = z
  .object({
    tags: z
      .array(z.string())
      .min(1, { message: "Must include at least 1 tag" }),
    description: z.optional(
      z
        .string()
        .max(500, { message: "Description must be 500 characters or fewer" }),
    ),
    image: z
      .instanceof(File)
      .refine(
        (file) => {
          return file.size <= 1024 * 1024 * 4;
        },
        { message: "Image must be 4MB or smaller" },
      )
      .refine(
        async (file) => {
          return await isValidImageFile(file);
        },
        { message: "Must be valid JPEG or PNG file" },
      ),
  })
  .refine((data) => data.tags.every((el) => el.length >= 3), {
    message: "Tags must be at least 3 characters",
    path: ["tags"],
  })
  .refine((data) => data.tags.every((el) => el.length <= 40), {
    message: "Tags must be 40 characters or fewer",
    path: ["tags"],
  });

export const NewPostSchema = z
  .object({
    publicId: z.string(),
    tags: z
      .array(z.string())
      .min(1, { message: "Must include at least 1 tag" }),
    description: z.optional(
      z
        .string()
        .max(500, { message: "Description must be 500 characters or fewer" }),
    ),
    sourceUrl: z.string().url(),
    thumbnailUrl: z.string().url(),
    width: z.optional(z.number()),
    height: z.optional(z.number()),
  })
  .refine((data) => data.tags.every((el) => el.length >= 3), {
    message: "Tags must be at least 3 characters",
    path: ["tags"],
  })
  .refine((data) => data.tags.every((el) => el.length <= 50), {
    message: "Tags must be 50 characters or fewer",
    path: ["tags"],
  });

export const SearchSchema = z.object({
  query: z.string().min(3),
  isStrictSearch: z.optional(z.boolean()),
  sortBy: z.optional(z.enum(["asc", "desc"])),
  dateRange: z.optional(
    z.object({
      from: z.date().min(new Date(2024, 1, 1)),
      to: z.optional(z.date().max(new Date())),
    }),
  ),
});

export const ChangeUsernameSchema = z.object({
  username: z
    .string()
    .regex(new RegExp("^[a-zA-Z0-9_]*$"), {
      message: "Invalid characters used",
    })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be 20 characters or fewer" }),
});
