import { AlbumsPostCardList } from "@/components/posts/albums-post-card-list";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface AlbumPageProps {
  params: {
    username: string;
    albumPublicId: string;
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const dbUser = await db.user.findUnique({
    where: {
      name: params.username,
    },
  });

  if (!dbUser) {
    notFound();
  }

  const album = await db.album.findUnique({
    where: {
      publicId: params.albumPublicId,
    },
  });

  if (!album) {
    notFound();
  }

  return (
    <div className="flex h-full w-full items-center overflow-y-auto">
      <div className=" flex h-full w-full flex-col items-center overflow-y-auto">
        <div className="relative flex w-full items-center p-2">
          <Link
            href={`/user/${dbUser.name}/albums`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-0 p-0",
            )}
          >
            <ChevronLeft size={32} />
          </Link>
          <div className="flex w-full flex-col items-center justify-center">
            <p className=" text-lg font-medium">{album.name}</p>
            <Separator className="w-1/2" />
          </div>
        </div>
        <AlbumsPostCardList
          endpoint="/api/posts/infinite/albums"
          albumId={album.id}
          albumPublicId={album.publicId}
        />
      </div>
    </div>
  );
}
