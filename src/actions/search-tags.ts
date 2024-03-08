"use server";

import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function searchTags(inputValue: string) {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (inputValue.length < 3) {
    return { error: "Input too short" };
  }

  const fullTextSearchInput = inputValue
    .trim()
    .split(" ")
    .map((word) => word + ":*")
    .join(" & ");

  const searchResults = await db.tag.findMany({
    where: {
      name: {
        search: fullTextSearchInput,
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
