export interface HomePageProps {
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
        };
      };
    };
  };
}

export interface WhereClause {
  AND: (TagsQuery | DateFilterConditional)[] | undefined;
  NOT?: StrictSearchConditional | undefined;
}