"use server";

import * as z from "zod";
import db from "@/lib/db";
import { settingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { hashPassword, comparePasswords } from "@/lib/passwords";
import { revalidatePath } from "next/cache";

export async function settings(values: z.infer<typeof settingsSchema>) {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = comparePasswords(values.password, dbUser.password);

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = hashPassword(values.newPassword);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  try {
    await db.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      },
    });
  } catch (error) {
    return { error: "Something went wrong updating the settings" };
  }

  revalidatePath("/");
  return {
    success: "Settings Updated!",
  };
}
