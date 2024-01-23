import { useSession } from "next-auth/react";

export function useCurrentRole() {
  const session = useSession();

  return session.data?.user?.role;
}

// Use hooks functions inside client components
// use the functions in /lib/auth.ts in server components/route handlers/server actions
