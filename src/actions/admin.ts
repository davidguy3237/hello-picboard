"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function admin() {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { success: "Allowed!" };
  }

  return { error: "Forbidden!" };
}

// This page is just to test role protected server actions
