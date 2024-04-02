import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const tag = searchParams.get("tag");

  if (!tag) {
    return NextResponse.json("Missing tag", { status: 400 });
  }

  if (tag.length < 3) {
    return NextResponse.json("Tag too short", { status: 400 });
  }

  const fullTextSearchInput = tag
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

  return NextResponse.json(formattedTags, { status: 200 });
}
