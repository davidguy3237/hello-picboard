import {
  DateFilterConditional,
  HomePageProps,
  StrictSearchConditional,
  WhereClause,
} from "@/app/(public)/home/types";
import { PaginationSection } from "@/components/pagination-section";
import { PostCardList } from "@/components/post-card-list";
import db from "@/lib/db";
import { SearchSchema } from "@/schemas";
import * as z from "zod";

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams?.query;
  const sortBy = searchParams?.sort || "desc";
  const isStrictSearch = searchParams?.strict === "true";
  const fromDate = searchParams?.from;
  const toDate = searchParams?.to;
  const currentPage = Number(searchParams?.page) || 1;
  const postsPerPage = Number(searchParams?.count) || 40;

  // TODO: Do more zod validation here
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
      .filter((tag) => tag) // filter out empty strings
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

  if (whereClause.AND) {
    const dateFilter: DateFilterConditional = {
      createdAt: validatedFromDate && {
        gte: validatedFromDate ? new Date(validatedFromDate) : undefined,
        lte: validatedToDate ? new Date(validatedToDate) : undefined,
      },
    };

    whereClause.AND.push(dateFilter);
  }

  if (whereClause.AND && validatedIsStrictSearch) {
    const strictSearch: StrictSearchConditional = {
      tags: {
        some: {
          NOT: {
            name: {
              in: tagsToSearch,
            },
          },
        },
      },
    };

    whereClause.NOT = strictSearch;
  }

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: validatedSortBy,
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
      <PostCardList posts={posts} />
      <PaginationSection
        postsPerPage={postsPerPage}
        totalPostsCount={totalPostsCount}
        currentPage={currentPage}
      />
    </>
  );
}
