"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import db from "@/lib/db";
import { getUserByEmail } from "@/data/user";
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

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
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

  return { success: "Confirmation email sent" };
}
