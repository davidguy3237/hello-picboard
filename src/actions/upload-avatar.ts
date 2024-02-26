"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { customAlphabet } from "nanoid";
import sharp from "sharp";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

const acceptedFileTypes = ["image/jpeg", "image/png"];
const maxFileSize = 1024 * 1024 * 4; // 4MB

export async function uploadAvatar(uploadAvatarData: FormData) {
  const user = await currentUser();

  console.log("USER", user);
  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  console.log("DB USER", dbUser);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const avatarImage = uploadAvatarData.get("avatar") as File;

  if (!avatarImage) {
    return {
      error: "No avatar image provided",
    };
  }

  const fileExtension = ".jpg";
  const folderName = "avatars";
  const nanoid = customAlphabet(process.env.NANOID_ALPHABET!, 12);
  const publicId = nanoid();

  const fileBuffer = Buffer.from(await avatarImage.arrayBuffer());

  const resizedAvatarObj = await sharp(fileBuffer)
    .resize(100, 100)
    .jpeg()
    .toBuffer({ resolveWithObject: true });

  const { data: resizedAvatarBuffer, info: resizedAvatarInfo } =
    resizedAvatarObj;

  const putAvatar = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME!,
    Key: `${folderName}/${publicId}${fileExtension}`,
    ContentType: avatarImage.type,
    ContentLength: resizedAvatarInfo.size,
    Body: resizedAvatarBuffer,
  });

  try {
    console.log("UPLOADING AVATAR TO BUCKET");
    await s3.send(putAvatar);
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to upload image",
    };
  }

  const avatarUrl = `${process.env.B2_FRIENDLY_URL}/file/${process.env.B2_BUCKET_NAME}/avatars/${publicId}${fileExtension}`;

  console.log("HERE IS THE URL", avatarUrl);
  console.log("ADDING URL TO PROFILE", dbUser.id);
  await db.user.update({
    where: { id: dbUser.id },
    data: {
      image: avatarUrl,
    },
  });

  console.log("REVALIDATING PATH");

  revalidatePath("/");
  return {
    success: {
      avatarUrl,
    },
  };
}
