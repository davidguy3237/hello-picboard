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

export interface UserSpecificQuery {
  user: {
    name: string;
  };
}

export interface WhereClause {
  AND: (TagsQuery | DateFilterConditional | UserSpecificQuery)[] | undefined;
  NOT?: StrictSearchConditional | undefined;
}