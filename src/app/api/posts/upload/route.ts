import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { NewPostSchema } from "@/schemas";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PostCategory } from "@prisma/client";
import { customAlphabet } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

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

export async function POST(req: NextRequest) {
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
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const image = formData.get("image") as File;
  const description = formData.get("description") as string;
  const category = formData.get("category") as PostCategory;
  const tags = formData.getAll("tags[]");

  if (!image) {
    return NextResponse.json("Missing image", { status: 400 });
  }
  if (!acceptedFileTypes.includes(image.type)) {
    return NextResponse.json("Invalid file type", { status: 400 });
  }
  if (image.size > maxFileSize) {
    return NextResponse.json("File too large", { status: 400 });
  }
  if (tags.length === 0) {
    return NextResponse.json("No tags provided", { status: 400 });
  }
  if (!category) {
    return NextResponse.json("No category provided", { status: 400 });
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
    return NextResponse.json(
      { error: "Failed to upload image", details: error },
      { status: 500 },
    );
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
    category,
  });

  if (!validatedFields.success) {
    return NextResponse.json("Something went wrong", { status: 400 });
  } else {
    try {
      const newPost = await db.post.create({
        data: {
          publicId,
          sourceUrl,
          thumbnailUrl,
          description,
          width,
          height,
          userId: user.id,
          category,
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

      return NextResponse.json(
        { postUrl: `/post/${newPost.publicId}` },
        { status: 201 },
      );
    } catch (error) {
      // TODO: If adding to database fails, delete uploaded files?
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 },
      );
    }
  }
}
