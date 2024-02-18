import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import { comparePasswords } from "./lib/passwords";

export default {
  providers: [
    Github({
      // TODO: Probably remove at some point
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Twitter({ // TODO: Setup twitter oauth after deploying because they won't accept localhost
    //   clientId: process.env.TWITTER_CLIENT_ID,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET,
    // }),
    Credentials({
      async authorize(credentials, request) {
        // Gives full control over how you handle the credentials received from the user.
        // The existence/correctness of a field cannot be guaranteed at compile time, so you should always validate the input before using it
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            return null;
          }

          const passwordsMatch = comparePasswords(password, user.password);

          if (passwordsMatch) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

// For more info:
// https://authjs.dev/guides/upgrade-to-v5?authentication-method=middleware#edge-compatibility
