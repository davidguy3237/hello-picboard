import { auth } from "@/auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_PROTECTED_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  protectedRoutes,
  publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";

// Prisma is not compatible with the edge runtime so need to a separate auth function for middleware
// const { auth } = NextAuth(authConfig);

export default auth((req) => {
  console.log("MIDDLEWARE IS BEING CALLED");
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if (
      nextUrl.pathname === "/auth/new-password" &&
      !nextUrl.searchParams.get("token")
    ) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
  }

  if (nextUrl.pathname === "/") {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isProtectedRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname + (nextUrl.search || "");
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(
        `${DEFAULT_PROTECTED_REDIRECT}?cbu=${encodedCallbackUrl}`,
        nextUrl,
      ),
    );
  }

  // if (!isLoggedIn && !isPublicRoute) {
  //   let callbackUrl = nextUrl.pathname;

  //   if (nextUrl.search) {
  //     callbackUrl += nextUrl.search;
  //   }

  //   const encodedCallbackUrl = encodeURIComponent(callbackUrl);

  //   return Response.redirect(
  //     new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
  //   );
  // }

  return null;
});

// With the recommended matcher, all routes are protected by Clerk's authentication middleware, with the exception of internal /_next/ routes and static files.
// Static files are detected by matching on paths that end in .+\..+.
// https://clerk.com/docs/references/nextjs/auth-middleware
export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], <-- Provided by NextAuth
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"], // Better one provided by Clerk Auth
};
