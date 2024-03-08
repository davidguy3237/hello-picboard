import db from "@/lib/db";
import { notFound } from "next/navigation";
import { AlbumCard } from "./components/album-card";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewAlbumButton } from "./components/new-album-button";

export default async function UserAlbumsPage({
  params,
}: {
  params: { username: string };
}) {
  const dbUser = await db.user.findUnique({
    where: {
      name: params.username,
    },
  });

  if (!dbUser) {
    notFound();
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
      userId: dbUser.id,
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

  return (
    <div className="flex h-full w-full gap-4 p-4">
      {albums.length ? (
        albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            username={params.username}
            userId={dbUser.id}
          />
        ))
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <p className="font-medium italic text-muted-foreground">
            No albums found...
          </p>
        </div>
      )}
    </div>
  );
}
