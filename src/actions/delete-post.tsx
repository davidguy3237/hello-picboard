"use server";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function deletePost(publicId: string) {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const deletedPost = await db.post.delete({
    where: {
      publicId: publicId,
      userId: user.id,
    },
  });

  console.log(deletedPost);

  if (!deletedPost) {
    return {
      error: "There was a problem deleting this post",
    };
  } else {
    return {
      success: "Post successfully deleted!",
    };
  }
}
