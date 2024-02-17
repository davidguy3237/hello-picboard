import { ImageCard } from "@/components/image-card";
import db from "@/lib/db";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    page?: string;
  };
}) {
  const query = searchParams?.q;
  const page = Number(searchParams?.page || 1);
  console.log("HOME PAGE");
  console.log(query, page);

  const tagsToSearch = query
    ?.trim()
    .split(",")
    .map((tag) => `${tag.trim()}`);

  const whereClause = {
    AND: tagsToSearch?.map((tag) => ({
      tags: {
        some: {
          name: tag,
        },
      },
    })),
  };

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      tags: {
        select: {
          name: true,
        },
      },
    },
    skip: (page - 1) * 100,
    take: 100,
    where: whereClause,
  });

  // TODO: add pagination
  return (
    <div className="flex max-w-screen-2xl flex-row flex-wrap justify-center">
      {posts.map((post) => (
        <ImageCard
          key={post.sourceUrl}
          sourceUrl={post.sourceUrl}
          thumbnailUrl={post.thumbnailUrl}
          description={post.description ?? "No description"}
          createdAt={post.createdAt}
          username={post.user?.name ?? "deleted"}
          userId={post.userId ?? "deleted"}
          tags={post.tags}
        />
      ))}
    </div>
  );
}
