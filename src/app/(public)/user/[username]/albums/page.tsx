import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import Link from "next/link";
import { AlbumCard } from "./components/album-card";

export default async function UserAlbumsPage() {
  const user = await currentUser();
  const albums = await db.album.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return (
    <div className="flex h-full w-full gap-4 p-4">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}
