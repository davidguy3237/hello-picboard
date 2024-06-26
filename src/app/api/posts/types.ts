import { PostCategory } from "@prisma/client";

export interface TagsQuery {
  tags: {
    some: {
      name: {
        search: string;
      };
    };
  };
}

export interface DateFilterConditional {
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface StrictSearchConditional {
  tags: {
    some: {
      NOT: {
        name: {
          in: string[] | undefined;
          mode: "insensitive";
        };
      };
    };
  };
}

export interface UserSpecificQuery {
  user: {
    name: string;
  };
}

export interface FavoritesQuery {
  favorites: {
    some: {
      userId: string;
    };
  };
}

export interface CategoryQuery {
  category: PostCategory;
}

export interface WhereClause {
  AND: (
    | TagsQuery
    | DateFilterConditional
    | UserSpecificQuery
    | FavoritesQuery
    | CategoryQuery
  )[];
  NOT?: StrictSearchConditional | undefined;
}
