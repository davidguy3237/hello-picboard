import {
  DateFilterConditional,
  StrictSearchConditional,
  WhereClause,
} from "@/app/(public)/home/types";
import db from "@/lib/db";
import { SearchSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const cursor = searchParams.get("cursor");

  const query = searchParams.get("query");
  const sortBy = searchParams.get("sort") || "desc";
  const isStrictSearch = searchParams.get("strict") === "true";
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

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
          publicId: cursor,
        }
      : undefined,
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
