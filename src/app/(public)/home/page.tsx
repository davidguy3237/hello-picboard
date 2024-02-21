import { PaginationSection } from "@/components/pagination-section";
import { PostList } from "@/components/post-list";
import db from "@/lib/db";
import { SearchSchema } from "@/schemas";
import { DateRange } from "react-day-picker";

interface HomePageProps {
  searchParams?: {
    query?: string;
    page?: string;
    sort?: "asc" | "desc";
    count?: string;
    strict?: string;
    from?: string;
    to?: string;
  };
}

interface TagsQuery {
  tags: {
    some: {
      name: {
        search: string;
      };
    };
  };
}

interface DateFilter {
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

interface WhereClause {
  AND: (TagsQuery | DateFilter)[] | undefined;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams?.query;
  const sortBy = searchParams?.sort || "desc";
  const isStrictSearch = searchParams?.strict === "true";
  const fromDate = searchParams?.from;
  const toDate = searchParams?.to;
  const currentPage = Number(searchParams?.page) || 1;
  const postsPerPage = Number(searchParams?.count) || 40;

  const params = {
    query,
    sortBy,
    isStrictSearch,
    dateRange:
      fromDate || toDate
        ? {
            from: fromDate ? new Date(fromDate) : undefined,
            to: toDate ? new Date(toDate) : undefined,
          }
        : undefined,
  };

  let tagsToSearch: string[] | undefined;
  let validatedSortBy: "asc" | "desc" = "desc";
  let validatedIsStrictSearch: boolean | undefined;
  let validatedFromDate: Date | undefined;
  let validatedToDate: Date | undefined;

  const validatedParams = SearchSchema.safeParse(params);
  if (validatedParams.success) {
    const validatedQuery = validatedParams.data.query;
    validatedSortBy = validatedParams.data.sortBy || "desc";
    validatedIsStrictSearch = validatedParams.data.isStrictSearch;
    validatedFromDate = validatedParams.data.dateRange?.from;
    validatedToDate = validatedParams.data.dateRange?.to;

    tagsToSearch = validatedQuery
      ?.trim()
      .split(",")
      .map((tag) => tag.trim());
  }

  const whereClause: WhereClause = {
    AND: tagsToSearch?.map((tag) => ({
      tags: {
        some: {
          name: {
            search: tag,
          },
        },
      },
    })),
  };

  whereClause.AND?.push({
    createdAt: validatedFromDate && {
      gte: validatedFromDate ? new Date(validatedFromDate) : undefined,
      lte: validatedToDate ? new Date(validatedToDate) : undefined,
    },
  });

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: validatedSortBy,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      tags: true,
    },
    skip: (currentPage - 1) * postsPerPage,
    take: postsPerPage,
    where: whereClause,
  });

  // console.log(posts);

  // This is kinda jank
  const filteredPosts = posts.filter((post) =>
    tagsToSearch ? post.tags.length === tagsToSearch.length : true,
  );

  const totalPostsCount = await db.post.count({
    where: whereClause,
  });

  return (
    <>
      <PostList posts={isStrictSearch ? filteredPosts : posts} />
      <PaginationSection
        postsPerPage={postsPerPage}
        totalPostsCount={totalPostsCount}
        currentPage={currentPage}
      />
    </>
  );
}
