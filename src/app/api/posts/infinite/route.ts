import {
  DateFilterConditional,
  StrictSearchConditional,
  WhereClause,
} from "@/app/api/posts/types";
import db from "@/lib/db";
import { SearchSchema } from "@/schemas";
import { PostCategory } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const cursor = searchParams.get("cursor");

  const query = searchParams.get("query") || undefined;
  const sortBy = searchParams.get("sort") || "desc";
  const isStrictSearch = searchParams.get("strict") === "true";
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  const username = searchParams.get("username");
  const category = searchParams.get("category");

  const paramsObj = {
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

  let originalTagsToSearch: string[] | undefined;
  let tagsToSearch: string[] | undefined;
  let validatedSortBy: "asc" | "desc" = "desc";
  let validatedIsStrictSearch: boolean | undefined;
  let validatedFromDate: Date | undefined;
  let validatedToDate: Date | undefined;

  const validatedParams = SearchSchema.safeParse(paramsObj);

  if (!validatedParams.success) {
    console.error(validatedParams.error);
    return NextResponse.json(
      { posts: [] },
      {
        status: 200,
      },
    );
  }

  if (validatedParams.success) {
    validatedSortBy = validatedParams.data.sortBy || "desc";
    validatedIsStrictSearch = validatedParams.data.isStrictSearch;
    validatedFromDate = validatedParams.data.dateRange?.from;
    validatedToDate = validatedParams.data.dateRange?.to;

    originalTagsToSearch = validatedParams.data.query
      ?.trim()
      .split(",")
      .filter((tag) => tag)
      .map((tag) => tag.trim());

    tagsToSearch = validatedParams.data.query
      ?.trim()
      .split(",")
      .filter((tag) => tag) // filter out empty strings
      .map((tag) =>
        tag
          .trim()
          .split(" ")
          .map((word) => word + ":*")
          .join(" & "),
      );
  }

  const whereClause: WhereClause = { AND: [] };

  if (tagsToSearch?.length) {
    whereClause.AND.push(
      ...tagsToSearch.map((tag) => ({
        tags: {
          some: {
            name: {
              search: tag,
            },
          },
        },
      })),
    );
  }

  if (validatedFromDate) {
    const dateFilter: DateFilterConditional = {
      createdAt: validatedFromDate && {
        gte: validatedFromDate ? new Date(validatedFromDate) : undefined,
        lte: validatedToDate ? new Date(validatedToDate) : undefined,
      },
    };
    whereClause.AND.push(dateFilter);
  }

  if (validatedIsStrictSearch) {
    const strictSearch: StrictSearchConditional = {
      tags: {
        some: {
          NOT: {
            name: {
              in: originalTagsToSearch,
              mode: "insensitive",
            },
          },
        },
      },
    };

    whereClause.NOT = strictSearch;
  }

  if (username) {
    whereClause.AND.push({
      user: {
        name: username,
      },
    });
  }

  if (
    category &&
    (Object.values(PostCategory) as string[]).includes(category)
  ) {
    whereClause.AND.push({
      category: category as PostCategory,
    });
  }

  const posts = await db.post.findMany({
    orderBy: [
      {
        createdAt: validatedSortBy,
      },
      {
        id: validatedSortBy,
      },
    ],
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    include: {
      _count: {
        select: {
          reports: true,
        },
      },
    },
    take: 25,
    skip: cursor ? 1 : 0,
    where: whereClause,
  });

  return NextResponse.json(
    { posts },
    {
      status: 200,
    },
  );
}
