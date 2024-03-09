import authConfig from "@/auth.config";
import { getAccountByUserId } from "@/data/account";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getUserById } from "@/data/user";
import db from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

if (!process.env.AUTH_SECRET) {
  throw new Error("Missing environment variable: AUTH_SECRET");
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
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
      // If no id, then user is logged out, so don't do anything to token
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.picture = existingUser.image || token.picture;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.role) {
          session.user.role = token.role;
        }

        session.user.name = token.name;
        session.user.email = token.email;

        session.user.image = token.picture;

        if (typeof token.isTwoFactorEnabled === "boolean") {
          session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        } else {
          session.user.isTwoFactorEnabled = false;
        }

        if (typeof token.isOAuth === "boolean") {
          session.user.isOAuth = token.isOAuth;
        } else {
          session.user.isOAuth = false;
        }
      }
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
  trustHost: true,
  ...authConfig,
});
