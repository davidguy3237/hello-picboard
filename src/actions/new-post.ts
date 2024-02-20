"use server";

import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { NewPostSchema } from "@/schemas";
import * as z from "zod";

export async function newPost(newPostData: z.infer<typeof NewPostSchema>) {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = NewPostSchema.safeParse(newPostData);

  if (!validatedFields.success) {
    return { error: "Invalid form" };
  }

  const { tags, sourceUrl, thumbnailUrl, description } = validatedFields.data;

  const post = await db.post.create({
    data: {
      sourceUrl,
      thumbnailUrl,
      description,
      userId: user.id,
      tags: {
        connectOrCreate: tags.map((tag) => {
          return {
            where: { name: tag },
            create: { name: tag },
          };
        }),
      },
    },
  });

  return { success: post };
}
