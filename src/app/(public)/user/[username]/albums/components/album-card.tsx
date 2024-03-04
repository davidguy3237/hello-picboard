import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Album } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

export function AlbumCard({
  album,
}: {
  album: Album & { _count: { posts: number } };
}) {
  console.log(album);
  return (
    <Link href={`/user/davidguy3237/albums/${album.name}`}>
      <Card className="h-60 w-60 overflow-hidden">
        <CardContent className="h-full w-full p-0">
          <Skeleton className="h-2/3 w-full rounded-b-none bg-secondary" />
          <div className="h-1/3 w-full p-1">
            <div className="w-full font-medium">{album.name}</div>
            <div>{format(album.createdAt, "MMMM d, yyyy")}</div>
            <div>{album._count.posts} Posts</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
