"use server";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { ReportSchema } from "@/schemas";
import * as z from "zod";

export async function reportPost(reportData: z.infer<typeof ReportSchema>) {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser || dbUser.banDate) {
    return { error: "Unauthorized" };
  }

  const validatedFields = ReportSchema.safeParse(reportData);
  if (!validatedFields.success) {
    return { error: "There was a problem reporting this post" };
  }

  const { postId, userId, reason, url, details } = validatedFields.data;

  const reportedPost = await db.report.create({
    data: {
      postId,
      userId,
      reason,
      url,
      details,
    },
  });

  if (!reportedPost) {
    return { error: "There was a problem reporting this post" };
  } else {
    return { success: "Post reported successfully" };
  }
}
