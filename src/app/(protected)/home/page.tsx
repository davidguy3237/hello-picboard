import { PaginationSection } from "@/components/pagination-section";
import { Post } from "@/components/post";
import { PostList } from "@/components/post-list";
import db from "@/lib/db";

interface HomePageProps {
  searchParams?: {
    q?: string;
    p?: string;
    sort?: "asc" | "desc";
    c?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams?.q;
  const currentPage = Number(searchParams?.p) || 1;
  const sortDirection = searchParams?.sort || "desc";
  const postsPerPage = Number(searchParams?.c) || 40;

  const tagsToSearch = query
    ?.trim()
    .split(",")
    .map((tag) => tag.trim());

  const whereClause = {
    AND: tagsToSearch?.map((tag) => ({
      tags: {
        some: {
          name: {
            contains: tag,
          },
        },
      },
    })),
  };

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: sortDirection,
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
    skip: (currentPage - 1) * postsPerPage,
    take: postsPerPage,
    where: whereClause,
  });

  const totalPostsCount = await db.post.count({
    where: whereClause,
  });

  return (
    <>
      <PostList posts={posts} />
      <PaginationSection
        postsPerPage={postsPerPage}
        totalPostsCount={totalPostsCount}
        currentPage={currentPage}
      />
    </>
  );
}
