import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("ALBUMS ROUTE HANDLER");
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
  const userToSearch = searchParams.get("user");
  const publicId = searchParams.get("post");

  const albums = await db.album.findMany({
    where: {
      userId: user.id,
    },
    include: {
      posts: {
        where: publicId ? { publicId } : undefined,
      },
    },
  });

  console.log("HERE ARE THE ALBUMS IN ROUTE HANDLER: ", albums);

  return NextResponse.json(
    { albums },
    {
      status: 200,
    },
  );
}
