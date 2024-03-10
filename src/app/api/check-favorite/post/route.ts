import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      },
    );
  }

  const searchParams = new URL(req.url).searchParams;
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { error: "Missing postId" },
      {
        status: 400,
      },
    );
  }

  const favorite = await db.favorites.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: user.id,
      },
    },
  });

  return NextResponse.json(
    { favorite },
    {
      status: 200,
    },
  );
}
