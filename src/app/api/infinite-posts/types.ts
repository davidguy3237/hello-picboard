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
