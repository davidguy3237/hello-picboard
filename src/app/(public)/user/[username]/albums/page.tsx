import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { AlbumCard } from "./components/album-card";
import { NewAlbumButton } from "./components/new-album-button";

export default async function UserAlbumsPage({
  params,
}: {
  params: { username: string };
}) {
  const user = await currentUser();
  const dbUser = await db.user.findUnique({
    where: {
      name: params.username,
    },
  });

  if (!dbUser) {
    notFound();
  }

  // TODO: this page caches on the server, so if the user views the album page, goes to the home page,
  // creates a new album, and then goes back to the album page,
  // it will not show the updated list of albums until the page is refreshed
  // possible solution is to fetch the data client side, instead of server side

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
      {albums.length > 0 &&
        albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            username={params.username}
            userId={dbUser.id}
          />
        ))}
      {user?.id === dbUser.id ? (
        <NewAlbumButton />
      ) : albums.length === 0 ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <p className="font-medium italic text-muted-foreground">
            No albums found...
          </p>
        </div>
      ) : null}
    </div>
  );
}
