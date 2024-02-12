"use server";

import * as crypto from "crypto";
import sharp from "sharp";
import { currentUser } from "@/lib/auth";
import { customAlphabet } from "nanoid";

const acceptedTypes = ["image/jpeg", "image/png"];
const maxFileSize = 1024 * 1024 * 5;

const nanoidCustomAlphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

export async function uploadImageB2(formdata: FormData) {
  if (!formdata) {
    return { error: "No FormData" };
  }

  const user = currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const file = formdata.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  if (!acceptedTypes.includes(file.type)) {
    return { error: "Invalid file type" };
  }

  if (file.size > maxFileSize) {
    return { error: "File too large" };
  }

  const applicationKey =
    process.env.B2_APPLICATION_KEY_ID + ":" + process.env.B2_APPLICATION_KEY;
  const applicationKeyBuffer = Buffer.from(applicationKey);
  const applicationKeyBase64 = applicationKeyBuffer.toString("base64");

  const getAuthResult = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    {
      method: "GET",
      headers: {
        Authorization: "Basic " + applicationKeyBase64,
      },
    },
  );

  const { accountId, authorizationToken, apiInfo } = await getAuthResult.json();
  const { apiUrl, bucketId, bucketName, downloadUrl } = apiInfo.storageApi;

  const getUploadUrlResult = await fetch(
    `${apiUrl}/b2api/v3/b2_get_upload_url?bucketId=${bucketId}`,
    {
      method: "GET",
      headers: {
        Authorization: authorizationToken,
      },
    },
  );

  const { uploadUrl, authorizationToken: uploadUrlAuthToken } =
    await getUploadUrlResult.json();

  const nanoid = customAlphabet(nanoidCustomAlphabet, 36);
  const sourcefileExtension = file.type === "image/jpeg" ? ".jpg" : ".png";
  const thumbnailFileExtension = ".webp";
  const fileName = nanoid();
  const folderName = "thumbnails";

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const width = 400;
  const thumbnailObject = await sharp(fileBuffer)
    .resize(width)
    .webp()
    .toBuffer({ resolveWithObject: true });

  const { data: thumbnailBuffer, info: thumbnailInfo } = thumbnailObject;

  const sourceChecksum = crypto
    .createHash("sha1")
    .update(fileBuffer)
    .digest("hex");
  const thumbnailChecksum = crypto
    .createHash("sha1")
    .update(thumbnailBuffer)
    .digest("hex");

  try {
    await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: uploadUrlAuthToken,
        "X-Bz-File-Name": fileName + sourcefileExtension,
        "Content-Type": file.type,
        "Content-Length": file.size.toString(),
        "X-Bz-Content-Sha1": sourceChecksum,
      },
      body: fileBuffer,
    });
    await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: uploadUrlAuthToken,
        "X-Bz-File-Name": folderName + "/" + fileName + thumbnailFileExtension,
        "Content-Type": "image/webp",
        "Content-Length": thumbnailInfo.size.toString(),
        "X-Bz-Content-Sha1": thumbnailChecksum,
      },
      body: thumbnailBuffer,
    });
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }

  return {
    success: {
      sourceUrl: `${downloadUrl}/file/${bucketName}/${fileName}${sourcefileExtension}`,
      thumbnailUrl: `${downloadUrl}/file/${bucketName}/${folderName}/${fileName}${thumbnailFileExtension}`,
    },
  };
}
