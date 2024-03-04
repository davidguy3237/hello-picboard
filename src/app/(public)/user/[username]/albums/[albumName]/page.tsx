import { PostCard } from "@/components/posts/post-card";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

interface AlbumPageProps {
  params: {
    albumName: string;
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const user = await currentUser();
  const albumName = decodeURI(params.albumName);
  console.log(albumName);

  const posts = await db.post.findMany({
    where: {
      albums: {
        some: {
          name: albumName,
          userId: user?.id,
        },
      },
    },
    include: {
      favorites: {
        where: {
          userId: user?.id,
        },
      },
    },
  });

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto ">
      <div className="m-4 flex w-full max-w-screen-2xl flex-col items-center justify-center">
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-1">
          {posts.map((post, i) => {
            return (
              <PostCard
                key={post.sourceUrl}
                id={post.id}
                userId={post.userId || ""}
                publicId={post.publicId}
                sourceUrl={post.sourceUrl}
                thumbnailUrl={post.thumbnailUrl}
                isFavorited={post.favorites[0]?.userId === user?.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
