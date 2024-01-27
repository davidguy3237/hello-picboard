"use server";
import * as z from "zod";
import { ResetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendResetPasswordEmail } from "@/lib/email";

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
        "If this account exists, we will send you an email to reset your password.",
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendResetPasswordEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return {
    success:
      "If this account exists, we will send you an email to reset your password.",
  };
}
