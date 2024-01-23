import { useSession } from "next-auth/react";

export default function useCurrentUser() {
  const session = useSession();

  return session.data?.user;
}

// useSession() returns an object which has a key "data", inside of which has a key "user"
// Use this hook in order to bypass doing something like "session.data?.user" every time.
// Use hooks functions inside client components
// use the functions in /lib/auth.ts in server components/route handlers/server actions
