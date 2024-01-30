import NextAuth, { Session } from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { UserRole } from "@prisma/client";
import { getAccountByUserId } from "./data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      console.log("I AM INSIDE LINKACCOUNT");
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("I AM INSIDE THE SIGNIN CALLBACK");
      // console.log({user: user, account: account, profile: profile, email: email, credentials: credentials});

      // Allow OAuth without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      // Prevent sign in without email verification
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) {
        return false;
      }

      // 2FA check
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        if (!twoFactorConfirmation) {
          return false;
        }

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async jwt({ token, user, account, profile, trigger, session }) {
      console.log("I AM INSIDE JWT CALLBACK");
      // if (token) {
      //   console.log({ token: token, user: user, account: account, profile: profile, trigger: trigger, session: session });
      // }
      if (!token.sub) {
        return token;
      }
      // If user exists, pass relevant info into the JWT token, which then gets passed into the session to be used
      const existingUser = await getUserById(token.sub);
      if (!existingUser) {
        return token;
      }
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token?: any }) {
      console.log("I AM INSIDE SESSION CALLBACK");
      // console.log({ startingSession: session, token: token });

      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.role) {
          session.user.role = token.role;
        }
        // pass user info from token into session to be accessed by client
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.isOAuth = token.isOAuth;
      }
      // console.log({ updatedSession: session });
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  ...authConfig,
});
