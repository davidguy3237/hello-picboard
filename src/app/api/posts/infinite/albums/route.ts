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
  SELECT post.id, 
  post.public_id AS "publicId", 
  post.user_id AS "userId", 
  post.source_url AS "sourceUrl", 
  post.thumbnail_url AS "thumbnailUrl", 
  post.description, 
  post.width, 
  post.height, 
  post.created_at AS "createdAt", 
  post.updated_at AS "updatedAt", 
  json_object_agg('postAddedToAlbumDate', posts_albums.created_at) as album,
  json_agg(json_build_object('postId', favorites.post_id, 'userId', favorites.user_id, 'createdAt', favorites.created_at)) AS favorites
  FROM post
  LEFT JOIN favorites ON post.id = favorites.post_id
  JOIN posts_albums ON post.id = posts_albums.post_id
  WHERE posts_albums.album_id = ${albumId}
  AND (${cursorId}::text IS NULL OR (posts_albums.created_at < ${cursorDate} AND post.id > ${cursorId}))
  GROUP BY post.id
  ORDER BY MAX(posts_albums.created_at) DESC, post.id DESC
  LIMIT 25
  `;

  return NextResponse.json(
    { posts },
    {
      status: 200,
    },
  );
}
