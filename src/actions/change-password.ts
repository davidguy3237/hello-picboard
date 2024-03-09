"use server";

import * as z from "zod";
import { ChangePasswordSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { comparePasswords, hashPassword } from "@/lib/passwords";
import { getUserById } from "@/data/user";
import { sendPasswordChangedEmail } from "@/lib/email";
import { generatePasswordResetToken } from "@/lib/tokens";

export async function changePassword(
  values: z.infer<typeof ChangePasswordSchema>,
) {
  const user = await currentUser();

  if (!user || user.isOAuth) {
    return {
      error: "Unauthorized",
    };
  }

  const existingUser = await getUserById(user.id);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedFields = ChangePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { currentPassword, newPassword } = values;

  const passwordsMatch = comparePasswords(
    currentPassword,
    existingUser.password,
  );

  if (!passwordsMatch) {
    return { error: "Incorrect password!" };
  }

  const hashedNewPassword = hashPassword(newPassword);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedNewPassword },
  });

  sendPasswordChangedEmail(existingUser.name, existingUser.email);

  return { success: "Password updated!" };
}
