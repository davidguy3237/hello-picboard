"use server";
import { getUserByEmail } from "@/data/user";
import { sendResetPasswordEmail } from "@/lib/email";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetPasswordSchema } from "@/schemas";
import * as z from "zod";

export async function resetPassword(
  values: z.infer<typeof ResetPasswordSchema>,
) {
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      success:
        "If this account exists, we've sent you an email to change your password.",
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  sendResetPasswordEmail(
    existingUser.name,
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return {
    success:
      "If this account exists, we've sent you an email to change your password.",
  };
}
