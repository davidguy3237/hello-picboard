"use server";

import * as z from "zod";
import { EditPostSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function editPost(editData: z.infer<typeof EditPostSchema>) {
  const user = await currentUser();
  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedFields = EditPostSchema.safeParse(editData);
  if (!validatedFields.success) {
    return {
      error: "There was a problem editing this post",
    };
  }

  const tagsToDisconnect = validatedFields.data.originalTags
    .filter((tag) => !validatedFields.data.updatedTags.includes(tag))
    .map((tag) => ({ name: tag }));

  const formattedUpdatedTags = validatedFields.data.updatedTags.map((tag) => ({
    where: { name: tag },
    create: { name: tag },
  }));

  const updatedPost = await db.post.update({
    where: {
      publicId: validatedFields.data.publicId,
      userId: user.id,
    },
    data: {
      description: validatedFields.data.description,
      tags: {
        connectOrCreate: formattedUpdatedTags,
        disconnect: tagsToDisconnect,
      },
    },
  });

  if (!updatedPost) {
    return {
      error: "There was a problem editing this post",
    };
  } else {
    return {
      success: "Post edited!",
    };
  }
}
