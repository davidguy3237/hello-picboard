"use server";

import { getUserByEmail, getUserByUsername } from "@/data/user";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { hashPassword } from "@/lib/passwords";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "@/schemas";
import * as z from "zod";

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

  try {
    await db.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong registering your account." };
  }

  const verificationToken = await generateVerificationToken(email);

  sendVerificationEmail(
    username,
    verificationToken.email,
    verificationToken.token,
  );

  return { success: "Please check your email for a confirmation link!" };
}
