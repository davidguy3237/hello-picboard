"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { EditPostSchema, NewPostSchema } from "@/schemas";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { customAlphabet } from "nanoid";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import * as z from "zod";

if (
  !process.env.B2_ENDPOINT ||
  !process.env.B2_REGION ||
  !process.env.B2_APPLICATION_KEY_ID ||
  !process.env.B2_APPLICATION_KEY
) {
  throw new Error(
    "Missing environment variable: B2_ENDPOINT, B2_REGION, B2_APPLICATION_KEY_ID or B2_APPLICATION_KEY",
  );
}

const acceptedFileTypes = ["image/jpeg", "image/png"];
const maxFileSize = 1024 * 1024 * 4; // 4MB

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

export async function newPost(newPostData: FormData) {
  if (
    !process.env.NANOID_ALPHABET ||
    !process.env.B2_BUCKET_NAME ||
    !process.env.NEXT_PUBLIC_PHOTOS_DOMAIN
  ) {
    throw new Error(
      "Missing environment variable: NANOID_ALPHABET, B2_BUCKET_NAME or NEXT_PUBLIC_PHOTOS_DOMAIN",
    );
  }

  const user = await currentUser();
  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const image = newPostData.get("image") as File;
  const description = newPostData.get("description") as string;
  const tags = newPostData.getAll("tags[]");

  if (!image) {
    return { error: "No image provided" };
  }
  if (!acceptedFileTypes.includes(image.type)) {
    return { error: "Invalid file type" };
  }
  if (image.size > maxFileSize) {
    return { error: "File too large" };
  }
  if (tags.length === 0) {
    return { error: "No tags provided" };
  }

  const sourcefileExtension = image.type === "image/jpeg" ? ".jpg" : ".png";
  const thumbnailFileExtension = ".webp";
  const folderName = "thumbnails";
  const nanoid = customAlphabet(process.env.NANOID_ALPHABET, 12);
  const publicId = nanoid();
  const thumbnailName = publicId + "-thumbnail";

  const fileBuffer = Buffer.from(await image.arrayBuffer());

  const { width, height } = await sharp(fileBuffer).metadata();

  const thumbnailWidth = 400;
  const thumbnailObject = await sharp(fileBuffer)
    .resize(thumbnailWidth)
    .webp()
    .toBuffer({ resolveWithObject: true });

  const { data: thumbnailBuffer, info: thumbnailInfo } = thumbnailObject;

  const putSource = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: publicId + sourcefileExtension,
    ContentType: image.type,
    ContentLength: image.size,
    Body: fileBuffer,
  });

  const putThumbnail = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: folderName + "/" + thumbnailName + thumbnailFileExtension,
    ContentType: "image/webp",
    ContentLength: thumbnailInfo.size,
    Body: thumbnailBuffer,
  });

  try {
    await s3.send(putSource);
    await s3.send(putThumbnail);
  } catch (error) {
    return { error: "Failed to upload image", details: error };
  }
  const sourceUrl = `${publicId}${sourcefileExtension}`;
  const thumbnailUrl = `${folderName}/${thumbnailName}${thumbnailFileExtension}`;

  const validatedFields = NewPostSchema.safeParse({
    publicId,
    tags,
    sourceUrl,
    thumbnailUrl,
    description,
    width,
    height,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields", details: validatedFields.error };
  } else {
    try {
      await db.post.create({
        data: {
          publicId,
          sourceUrl,
          thumbnailUrl,
          description,
          width,
          height,
          userId: user.id,
          tags: {
            connectOrCreate: validatedFields.data.tags.map((tag) => {
              return {
                where: { name: tag },
                create: { name: tag },
              };
            }),
          },
        },
      });

      return {
        success: {
          postUrl: `/post/${validatedFields.data.publicId}`,
        },
      };
    } catch (error) {
      // TODO: If adding to database fails, delete uploaded files?
      return { error: "Failed to create post", details: error };
    }
  }
}

export async function editPost(editData: z.infer<typeof EditPostSchema>) {
  const user = await currentUser();
  if (!user || (user.id !== editData.userId && user.role !== "ADMIN")) {
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

  let sanitizedUrl: string | undefined;

  if (validatedFields.data.originUrl) {
    const parsedUrl = new URL(validatedFields.data.originUrl);
    parsedUrl.search = "";
    sanitizedUrl = parsedUrl.toString();
  }

  const updatedPost = await db.post.update({
    where: {
      publicId: validatedFields.data.publicId,
      userId: editData.userId,
    },
    data: {
      description: validatedFields.data.description,
      category: validatedFields.data.category,
      originUrl: sanitizedUrl,
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

export async function deletePost(
  publicId: string,
  sourceUrl: string,
  thumbnailUrl: string,
) {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  if (!publicId || !sourceUrl || !thumbnailUrl) {
    return {
      error: "Invalid fields",
    };
  }

  const deletedPost = await db.post.delete({
    where: {
      publicId: publicId,
      userId: user.id,
    },
  });

  if (!deletedPost) {
    return {
      error: "There was a problem deleting this post",
    };
  }

  const deleteSource = new DeleteObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: sourceUrl,
  });
  const deleteThumbnail = new DeleteObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: thumbnailUrl,
  });

  try {
    await s3.send(deleteSource);
    await s3.send(deleteThumbnail);
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete image" };
  }

  return {
    success: "Post successfully deleted!",
  };
}

export async function deleteManyPosts(
  publicIds: string[],
  sourceUrls: string[],
  thumbnailUrls: string[],
) {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  if (!publicIds || !sourceUrls || !thumbnailUrls) {
    return {
      error: "Invalid fields",
    };
  }

  const deletedPosts = await db.post.deleteMany({
    where: {
      id: {
        in: publicIds,
      },
      userId: user.id,
    },
  });

  if (!deletedPosts) {
    return {
      error: "There was a problem deleting these posts",
    };
  }

  const deleteSources = new DeleteObjectsCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Delete: {
      Objects: sourceUrls.map((url) => {
        return {
          Key: url,
        };
      }),
    },
  });
  const deleteThumbnails = new DeleteObjectsCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Delete: {
      Objects: thumbnailUrls.map((url) => {
        return {
          Key: url,
        };
      }),
    },
  });

  try {
    await s3.send(deleteSources);
    await s3.send(deleteThumbnails);
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete images" };
  }

  revalidatePath(`/user/${user.name}/posts`);
  return {
    success: "Posts successfully deleted!",
  };
}

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
    const unfavorited = await db.favorites.delete({
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
