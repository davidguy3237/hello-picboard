import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      },
    );
  }

  const searchParams = new URL(req.url).searchParams;
  const postId = searchParams.get("postId");

  const albums = await db.album.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
    where: {
      userId: user.id,
    },
    include: {
      posts: {
        where: postId ? { postId } : undefined,
      },
    },
  });

  return NextResponse.json(
    { albums },
    {
      status: 200,
    },
  );
}
