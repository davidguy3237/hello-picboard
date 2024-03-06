"use server";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { NewAlbumSchema } from "@/schemas";
import * as z from "zod";
import { customAlphabet } from "nanoid";
import { revalidatePath } from "next/cache";

export async function createNewAlbum(
  newAlbumData: z.infer<typeof NewAlbumSchema>,
) {
  const user = await currentUser();

  if (!user || !user.id) {
    return {
      error: "Unauthorized",
    };
  }

  const nanoid = customAlphabet(process.env.NANOID_ALPHABET!, 12);
  const publicId = nanoid();

  const newAlbum = await db.album.create({
    data: {
      publicId,
      name: newAlbumData.albumName,
      userId: user.id,
    },
  });

  console.log("NEW ALBUM CREATED: ", newAlbum);

  revalidatePath(`/user/${user.name}/albums`);
  return {
    success: "Album created!",
  };
}
