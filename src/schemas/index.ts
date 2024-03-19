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
// TODO: add validation so that new password isn't the same as the current password.
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

export const BatchUploadSchema = z.object({
  tags: z.array(z.string()).min(1, { message: "Must include at least 1 tag" }),
  description: z.optional(
    z
      .string()
      .max(500, { message: "Description must be 500 characters or fewer" }),
  ),
  images: z.array(
    z
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
  ),
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
    sourceUrl: z
      .string()
      .refine((val) => val.endsWith(".jpg") || val.endsWith(".png")),
    thumbnailUrl: z
      .string()
      .refine((val) => val.startsWith("thumbnails/") && val.endsWith(".webp")),
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

export const EditPostSchema = z.object({
  publicId: z.string(),
  originalTags: z
    .array(z.string())
    .min(1, { message: "Must include at least 1 tag" }),
  updatedTags: z
    .array(z.string())
    .min(1, { message: "Must include at least 1 tag" }),
  description: z.optional(
    z
      .string()
      .max(500, { message: "Description must be 500 characters or fewer" }),
  ),
});

export const SearchSchema = z.object({
  query: z.string().min(3),
  isStrictSearch: z.optional(z.boolean()),
  sortBy: z.optional(z.enum(["asc", "desc"])),
  dateRange: z.optional(
    z.object({
      from: z.date().min(new Date(2024, 1, 1)),
      to: z.optional(z.date()),
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

export const NewAlbumSchema = z.object({
  postId: z.optional(z.string().min(1)),
  albumName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name must be 100 characters or fewer" }),
});

export const ReportSchema = z
  .object({
    postId: z.string().min(1),
    userId: z.string().min(1),
    reason: z.enum([
      "spam",
      "guidelines",
      "duplicate",
      "quality",
      "explicit",
      "unrelated",
      "other",
    ]),
    url: z
      .union([z.string().url({ message: "Invalid URL" }), z.literal("")])
      .refine(
        (url) => {
          if (url) {
            return url.includes("hellopicboard.com");
          }
          return true;
        },
        { message: "URL must be from hellopicboard.com" },
      ),
    details: z.optional(
      z
        .string()
        .max(1000, { message: "details must be 1000 characters or fewer" }),
    ),
  })
  .refine(
    (data) => {
      if (data.reason === "other" || data.reason === "guidelines") {
        return !!data.details;
      }
      return true;
    },
    {
      message: "Please provide details",
      path: ["details"],
    },
  )
  .refine(
    (data) => {
      if (data.reason === "duplicate" || data.reason === "quality") {
        return !!data.url;
      }
      return true;
    },
    {
      message: "A link to the other post is required",
      path: ["url"],
    },
  );
