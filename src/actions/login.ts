"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/email";
import { comparePasswords } from "@/lib/passwords";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export async function login(
  loginData: z.infer<typeof LoginSchema>,
  callbackUrl?: string,
) {
  const validatedFields = LoginSchema.safeParse(loginData);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const formattedEmail = email.toLowerCase();
  const existingUser = await getUserByEmail(formattedEmail);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Incorrect Email or Password!" };
  }

  const passwordsMatch = comparePasswords(password, existingUser.password);

  if (!passwordsMatch) {
    return { error: "Incorrect Email or Password!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );
    await sendVerificationEmail(
      existingUser.name,
      verificationToken.email,
      verificationToken.token,
    );

    return {
      success: "Please check your email to continue signing in.",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      await sendTwoFactorTokenEmail(existingUser.name, existingUser.email);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Incorrect Email or Password!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
}
