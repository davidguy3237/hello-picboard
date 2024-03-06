import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const searchParams = new URL(req.url).searchParams;
  const cursorId = searchParams.get("cursorId") || null;
  const cursorDate = searchParams.get("cursorDate") || null;

  // Raw query because Prisma can't order by a relation's createdAt column
  const posts = await db.$queryRaw`
  SELECT Post.*, JSON_ARRAYAGG(JSON_OBJECT('postId', PostFavorites.postId, 'userId', PostFavorites.userId, 'createdAt', PostFavorites.createdAt)) AS favorites
  FROM Post
  JOIN PostFavorites ON Post.id = PostFavorites.postId
  WHERE PostFavorites.userId = ${user.id}
  AND (${cursorId} IS NULL OR (PostFavorites.createdAt < ${cursorDate} AND Post.id > ${cursorId}))
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
