"use server";

import db from "@/lib/db";

export async function addPostToAlbum(albumId: string, postId: string) {
  const album = await db.album.update({
    where: {
      id: albumId,
    },
    data: {
      posts: {
        connect: {
          publicId: postId,
        },
      },
    },
  });

  console.log("added post to album", album);

  return {
    success: true,
  };
}

export async function removePostToAlbum(albumId: string, postId: string) {
  const album = await db.album.update({
    where: {
      id: albumId,
    },
    data: {
      posts: {
        disconnect: {
          publicId: postId,
        },
      },
    },
  });

  console.log("removed post from album", album);

  return {
    success: true,
  };
}
