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
  // I'm 90% repeating myself with these 2 queries, but I can't fix the error in the query at the bottom of the file
  let posts;
  if (cursorId && cursorDate) {
    posts = await db.$queryRaw`
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
    json_agg(json_build_object('postId', favorites.post_id, 'userId', favorites.user_id, 'createdAt', favorites.created_at)) AS favorites
    FROM post
    JOIN favorites ON post.id = favorites.post_id
    WHERE favorites.user_id = ${user.id}
    AND favorites.created_at < ${cursorDate}::timestamp 
    AND post.id > ${cursorId}
    GROUP BY post.id
    ORDER BY MAX(favorites.created_at) DESC, post.id DESC
    LIMIT 25
    `;
  } else {
    posts = await db.$queryRaw`
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
    json_agg(json_build_object('postId', favorites.post_id, 'userId', favorites.user_id, 'createdAt', favorites.created_at)) AS favorites
    FROM post
    JOIN favorites ON post.id = favorites.post_id
    WHERE favorites.user_id = ${user.id}
    GROUP BY post.id
    ORDER BY MAX(favorites.created_at) DESC, post.id DESC
    LIMIT 25
    `;
  }

  return NextResponse.json(
    { posts },
    {
      status: 200,
    },
  );
}

// THIS KEEPS THROWING PRISMA ERRORS (investigate?)
// code: 22P03
// message: 'ERROR: incorrect binary data format in bind parameter 3
// const posts = await db.$queryRaw`
// SELECT post.id,
// post.public_id AS "publicId",
// post.user_id AS "userId",
// post.source_url AS "sourceUrl",
// post.thumbnail_url AS "thumbnailUrl",
// post.description,
// post.width,
// post.height,
// post.created_at AS "createdAt",
// post.updated_at AS "updatedAt",
// json_agg(json_build_object('postId', favorites.post_id, 'userId', favorites.user_id, 'createdAt', favorites.created_at)) AS favorites
// FROM post
// JOIN favorites ON post.id = favorites.post_id
// WHERE favorites.user_id = ${user.id}
// AND (${cursorId}::text IS NULL OR (favorites.created_at < ${cursorDate}::timestamp AND post.id > ${cursorId}))
// GROUP BY post.id
// ORDER BY MAX(favorites.created_at) DESC, post.id DESC
// LIMIT 25
// `;
