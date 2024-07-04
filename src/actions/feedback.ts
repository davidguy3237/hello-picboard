"use server";

import * as z from "zod";
import db from "@/lib/db";
import { FeedbackSchema } from "@/schemas";

export async function sendFeedback(feedbackData: {
  username: string;
  details: string;
}) {
  const validatedFields = FeedbackSchema.safeParse(feedbackData);
  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      success: false,
      error: true,
    };
  }

  const { username, details } = validatedFields.data;
  const newFeedback = await db.feedback.create({
    data: {
      username,
      details,
    },
  });

  if (!newFeedback) {
    return {
      success: false,
      error: true,
    };
  } else {
    return {
      success: true,
      error: false,
    };
  }
}
