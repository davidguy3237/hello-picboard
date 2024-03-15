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

  const queryString = `albumId=${album.id}`;
  return (
    <div className="flex h-full w-full items-center overflow-y-auto">
      <Link
        href={`/user/${dbUser.name}/albums`}
        className={cn(buttonVariants({ variant: "ghost" }), "m-1 h-full p-0")}
      >
        <ChevronLeft size={32} />
      </Link>
      <div className=" flex h-full w-full flex-col items-center overflow-y-auto">
        <div className="flex w-full flex-col items-center p-2 text-center text-lg font-medium">
          <p>{album.name}</p>
          <Separator className="w-1/2" />
        </div>
        <AlbumsPostCardList
          queryString={queryString}
          endpoint="/api/posts/infinite/albums"
        />
      </div>
    </div>
  );
}
