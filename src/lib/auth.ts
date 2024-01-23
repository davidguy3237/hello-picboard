import { auth } from "@/auth";

export async function currentUser() {
  const session = await auth();

  return session?.user;
}

export async function currentRole() {
  const session = await auth();

  return session?.user?.role;
}

// Use hooks functions inside client components
// use the functions in /lib/auth.ts in server components/route handlers/server actions
