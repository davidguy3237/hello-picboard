"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggle2FA() {
  const user = await currentUser();

  if (!user || user.isOAuth) {
    return {
      error: "Unauthorized",
    };
  }

  const existingUser = await getUserById(user.id);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: "Unauthorized",
    };
  }

  const new2FAStatus = !existingUser.isTwoFactorEnabled;

  await db.user.update({
    where: { id: existingUser.id },
    data: { isTwoFactorEnabled: new2FAStatus },
  });

  revalidatePath("/settings");
  return {
    success: "Two Factor Authentication has been updated!",
  };
}
