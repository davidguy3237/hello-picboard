import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const searchParams = new URL(req.url).searchParams;
  const cursor = searchParams.get("cursor");

  // Have to do raw query because prisma can't sort by PostFavorites's createdAt
  const posts = await db.$queryRaw`
  SELECT Post.*, JSON_ARRAYAGG(JSON_OBJECT('postId', PostFavorites.postId, 'userId', PostFavorites.userId, 'createdAt', PostFavorites.createdAt)) AS favorites
  FROM Post
  JOIN PostFavorites ON Post.id = PostFavorites.postId
  WHERE PostFavorites.userId = ${user.id}
  AND (${cursor} IS NULL OR Post.publicId > ${cursor})
  GROUP BY Post.id
  ORDER BY PostFavorites.createdAt DESC, Post.id DESC
  LIMIT 25
  `;

  return NextResponse.json(
    { posts },
    {
      status: 200,
    },
  );
}
