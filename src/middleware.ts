import { auth } from "@/auth";
import authConfig from "@/auth.config";
import { DEFAULT_LOGIN_REDIRECT, authRoutes, protectedRoutes } from "@/routes";
import NextAuth from "next-auth";

// Prisma is not compatible with the edge runtime so need to a separate auth function for middleware
// const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  console.log("MIDDLEWARE IS BEING CALLED FROM: ", nextUrl.href);

  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isProtectedRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname + (nextUrl.search || "");
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/login?cbu=${encodedCallbackUrl}`, nextUrl),
    );
  }
});

export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Provided by NextAuth
  // matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"], // Better one provided by Clerk Auth
  matcher: [
    "/login",
    "/register",
    "/error",
    "/reset-password",
    "/new-password",
    "/new-verification",
    "/settings",
    "/upload",
    "/edit:path*",
  ],
};
