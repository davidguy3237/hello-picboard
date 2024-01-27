"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import db from "@/lib/db";
import { getUserByEmail, getUserByUsername } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { hashPassword } from "@/lib/passwords";

export async function register(registerData: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(registerData);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, username, password } = validatedFields.data;
  const hashedPassword = hashPassword(password);

  const existingUserEmail = await getUserByEmail(email);

  if (existingUserEmail) {
    return { error: "This email is already taken!" };
  }

  const existingUsername = await getUserByUsername(username);

  if (existingUsername) {
    return { error: "This username is already taken!" };
  }

  await db.user.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Please check your email for a confirmation link!" };
}
