import { AlbumCardsList } from "@/app/(public)/user/[username]/albums/components/album-cards-list";
import db from "@/lib/db";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

interface UserAlbumProps {
  params: {
    username: string;
  };
}

export async function generateMetadata(
  { params }: UserAlbumProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `${params.username}'s Albums - Hello! Picboard`,
  };
}

export default async function UserAlbumsPage({ params }: UserAlbumProps) {
  const dbUser = await db.user.findUnique({
    where: {
      name: decodeURIComponent(params.username),
    },
  });

  if (!dbUser) {
    notFound();
  }

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto">
      <AlbumCardsList username={params.username} userId={dbUser.id} />
    </div>
  );
}
