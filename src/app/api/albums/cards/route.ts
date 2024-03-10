import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const username = searchParams.get("username");
  const userId = searchParams.get("userId");

  if (!username || !userId) {
    return NextResponse.json("User not found", { status: 404 });
  }

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
      userId,
    },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
      posts: {
        include: {
          post: {
            select: {
              thumbnailUrl: true,
            },
          },
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return NextResponse.json(
    {
      albums,
    },
    {
      status: 200,
    },
  );
}
