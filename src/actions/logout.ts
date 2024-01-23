"use server";

import { signOut } from "@/auth";

export async function logOut() {
  // some server stuff
  await signOut();
}

// If you wanted to do some server stuff before signing out,
// you can run signOut() from "@/auth" inside of server actions and then import this server action into the client component
// instead of directly running signOut() provided by next-auth/react in the client components.
