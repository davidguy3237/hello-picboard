"use server";

import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function favoritePost(
  postId: string,
  currentlyFavorited: boolean,
) {
  const user = await currentUser();

  if (!user || !user.id) {
    return {
      error: "Unauthorized",
    };
  }

  if (currentlyFavorited) {
    const unfavorited = await db.postFavorites.delete({
      where: {
        postId_userId: {
          postId: postId,
          userId: user.id,
        },
      },
    });

    if (!unfavorited) {
      return {
        error: "There was a problem unliking this post",
      };
    } else {
      return { success: "Post unliked!" };
    }
  } else {
    const favoritedPost = await db.post.update({
      where: {
        id: postId,
      },
      data: {
        favorites: {
          create: {
            userId: user.id,
          },
        },
      },
    });

    if (!favoritedPost) {
      return {
        error: "There was a problem liking this post",
      };
    } else {
      return { success: "Post liked!" };
    }
  }
}
