import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const cursorId = searchParams.get("cursorId") || null;
  const cursorDate = searchParams.get("cursorDate") || null;
  const albumId = searchParams.get("albumId");

  if (!albumId) {
    return NextResponse.json("Album not found", { status: 404 });
  }

  const posts = await db.$queryRaw`
  SELECT Post.*, JSON_OBJECTAGG('postAddedToAlbumDate', PostAlbums.createdAt) as album, JSON_ARRAYAGG(JSON_OBJECT('postId', PostFavorites.postId, 'userId', PostFavorites.userId, 'createdAt', PostFavorites.createdAt)) AS favorites
  FROM Post
  LEFT JOIN PostFavorites ON Post.id = PostFavorites.postId
  JOIN PostAlbums ON Post.id = PostAlbums.postId
  WHERE PostAlbums.albumId = ${albumId}
  AND (${cursorId} IS NULL OR (PostAlbums.createdAt < ${cursorDate} AND Post.id > ${cursorId}))
  GROUP BY Post.id
  ORDER BY PostAlbums.createdAt DESC, Post.id DESC
  LIMIT 25
  `;

  return NextResponse.json(
    { posts },
    {
      status: 200,
    },
  );
}
