"use server";

import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { NewAlbumSchema } from "@/schemas";
import { Album } from "@prisma/client";
import { customAlphabet } from "nanoid";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export async function deleteAlbum(
  album: Album & {
    posts: {
      postId: string;
      albumId: string;
      createdAt: Date;
      post: { thumbnailUrl: string };
    }[];
    _count: { posts: number };
  },
) {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  if (user.id !== album.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const deletedAlbum = await db.album.delete({
    where: {
      id: album.id,
      userId: user.id,
    },
  });

  if (!deletedAlbum) {
    return {
      error: "Could not delete album",
    };
  }

  revalidatePath(`/user/${user.name}/albums`);
  return {
    success: "Album Deleted!",
  };
}

export async function createNewAlbum(
  newAlbumData: z.infer<typeof NewAlbumSchema>,
) {
  if (!process.env.NANOID_ALPHABET) {
    throw new Error("Missing environment variable: NANOID_ALPHABET");
  }

  const user = await currentUser();

  if (!user || !user.id) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedFields = NewAlbumSchema.safeParse(newAlbumData);

  if (!validatedFields.success) {
    return {
      error: "Invalid data",
    };
  }

  const { postId, albumName } = validatedFields.data;

  const nanoid = customAlphabet(process.env.NANOID_ALPHABET, 12);
  const publicId = nanoid();

  const newAlbum = await db.album.create({
    data: {
      publicId,
      name: albumName,
      userId: user.id,
    },
  });

  if (postId) {
    const result = await db.post.update({
      where: {
        id: postId,
      },
      data: {
        albums: {
          create: {
            albumId: newAlbum.id,
          },
        },
      },
    });

    if (!result) {
      return {
        error: "There was a problem adding post to new album",
      };
    }
  }
  if (!postId) {
    revalidatePath(`/user/${user.name}/albums`);
  }
  return {
    success: newAlbum,
  };
}

export async function addPostToAlbum(albumId: string, postId: string) {
  const user = await currentUser();
  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const album = await db.album.update({
    where: {
      id: albumId,
    },
    data: {
      posts: {
        create: {
          postId,
        },
      },
    },
  });

  if (!album) {
    return {
      error: "Could not add post to album",
    };
  }

  return {
    success: album,
  };
}

export async function removePostFromAlbum(albumId: string, postId: string) {
  const user = await currentUser();
  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const postsAlbum = await db.postsAlbums.delete({
    where: {
      postId_albumId: {
        postId,
        albumId,
      },
    },
  });

  if (!postsAlbum) {
    return {
      error: "Could not remove post from album",
    };
  }

  return {
    success: true,
  };
}

export async function removeManyPostsFromAlbum(
  albumId: string,
  albumPublicId: string,
  postIds: string[],
) {
  const user = await currentUser();
  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const postsAlbums = await db.postsAlbums.deleteMany({
    where: {
      postId: {
        in: postIds,
      },
      albumId,
    },
  });

  if (!postsAlbums) {
    return {
      error: "Could not remove posts from album",
    };
  }
  // TODO: for some reason this is not revalidating
  revalidatePath(`/user/${user.name}/albums/${albumPublicId}`);

  return {
    success: "Successfully removed posts from album",
  };
}
