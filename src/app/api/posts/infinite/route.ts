import {
  DateFilterConditional,
  StrictSearchConditional,
  WhereClause,
} from "@/app/api/posts/types";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { SearchSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  const searchParams = new URL(req.url).searchParams;
  const cursor = searchParams.get("cursor");

  const query = searchParams.get("query");
  const sortBy = searchParams.get("sort") || "desc";
  const isStrictSearch = searchParams.get("strict") === "true";
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  const username = searchParams.get("username");
  const showFavorites = searchParams.get("favorites") === "true";

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

  let tagsToSearch: string[] | undefined;
  let validatedSortBy: "asc" | "desc" = "desc";
  let validatedIsStrictSearch: boolean | undefined;
  let validatedFromDate: Date | undefined;
  let validatedToDate: Date | undefined;

  const validatedParams = SearchSchema.safeParse(paramsObj);

  if (validatedParams.success) {
    validatedSortBy = validatedParams.data.sortBy || "desc";
    validatedIsStrictSearch = validatedParams.data.isStrictSearch;
    validatedFromDate = validatedParams.data.dateRange?.from;
    validatedToDate = validatedParams.data.dateRange?.to;

    tagsToSearch = validatedParams.data.query
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

    if (validatedIsStrictSearch) {
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
  } else if (username && !whereClause.AND) {
    whereClause.AND = [
      {
        user: {
          name: username,
        },
      },
    ];
  } else if (showFavorites && user && user.id && !whereClause.AND) {
    whereClause.AND = [
      {
        favorites: {
          some: {
            userId: user.id,
          },
        },
      },
    ];
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
      favorites: {
        where: {
          userId: user?.id,
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
