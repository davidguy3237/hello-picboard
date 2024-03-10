"use client";

import { AlbumCard } from "@/app/(public)/user/[username]/albums/components/album-card";
import { NewAlbumButton } from "@/app/(public)/user/[username]/albums/components/new-album-button";
import { SkeletonAlbumCardList } from "@/components/skeletons/skeleton-album-card-list";
import useCurrentUser from "@/hooks/use-current-user";
import { Album } from "@prisma/client";
import { useEffect, useState } from "react";

export type AlbumCardType = {
  posts: ({
    post: {
      thumbnailUrl: string;
    };
  } & {
    postId: string;
    albumId: string;
    createdAt: Date;
  })[];
  _count: {
    posts: number;
  };
} & Album;

interface AlbumCardsListProps {
  username: string;
  userId: string;
}

export function AlbumCardsList({ username, userId }: AlbumCardsListProps) {
  const user = useCurrentUser();
  const [albums, setAlbums] = useState<AlbumCardType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      const response = await fetch(
        `/api/albums/cards?username=${username}&userId=${userId}`,
      );
      const data = await response.json();
      setIsLoading(false);
      setAlbums(data.albums);
    };

    fetchAlbums();
  }, [username, userId]);

  return (
    <>
      {isLoading ? (
        <SkeletonAlbumCardList />
      ) : albums.length > 0 ? (
        albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            username={username}
            userId={album.userId}
            setAlbums={setAlbums}
          />
        ))
      ) : user?.name !== username ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <p className="font-medium italic text-muted-foreground">
            No albums found...
          </p>
        </div>
      ) : null}
      {user?.name === username && !isLoading && (
        <NewAlbumButton setAlbums={setAlbums} />
      )}
    </>
  );
}
