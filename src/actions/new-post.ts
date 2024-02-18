"use server";

import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { NewPostSchema } from "@/schemas";
import db from "@/lib/db";

export async function newPost(newPostData: z.infer<typeof NewPostSchema>) {
  console.log("INSIDE NEW POST FUNCTION");
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
