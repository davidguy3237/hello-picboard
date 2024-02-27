"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { ChangeUsernameSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export async function changeUsername(
  values: z.infer<typeof ChangeUsernameSchema>,
) {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return {
      error: "Unauthorized",
    };
  }

  if (dbUser.lastUpdateName) {
    const timeSinceLastUpdate =
      new Date().getTime() - dbUser.lastUpdateName.getTime();
    const thirtyDays = 1000 * 60 * 60 * 24 * 30;
    if (timeSinceLastUpdate < thirtyDays) {
      const timeLeft = Math.ceil(
        (thirtyDays - timeSinceLastUpdate) / (1000 * 60 * 60 * 24),
      );
      return {
        error: `Please wait ${timeLeft} days before changing your username again.`,
      };
    }
  }

  const validatedFields = ChangeUsernameSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid username!" };
  }

  const { username } = validatedFields.data;

  const existingUsername = await db.user.findUnique({
    where: { name: username },
  });

  if (existingUsername) {
    return { error: "This username is already taken!" };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      name: username,
      lastUpdateName: new Date(),
    },
  });
  revalidatePath("/settings");
  return { success: "Username updated!" };
}
