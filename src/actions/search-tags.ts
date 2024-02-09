"use server";

import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function searchTags(inputValue: string) {
  const user = currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (inputValue.length < 3) {
    return { error: "Input too short" };
  }

  const searchResults = await db.tag.findMany({
    where: {
      name: {
        startsWith: inputValue,
      },
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  });

  const formattedTags = searchResults.map((item) => ({
    label: item.name,
    value: item.name,
  }));
  return { success: formattedTags };
}
