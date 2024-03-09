"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";
import { sendPasswordChangedEmail } from "@/lib/email";
import { hashPassword } from "@/lib/passwords";
import { generatePasswordResetToken } from "@/lib/tokens";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";

export async function newPassword(
  newPasswordObj: z.infer<typeof NewPasswordSchema>,
  token: string,
) {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(newPasswordObj);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = hashPassword(password);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  sendPasswordChangedEmail(existingUser.name, existingUser.email);

  return { success: "Password updated!" };
}
