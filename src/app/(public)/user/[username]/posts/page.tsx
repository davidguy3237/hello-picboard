import { PostCardList } from "@/components/posts/post-card-list";

interface PostTabsProps {
  params: {
    username: string;
  };
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

export default function UserPostsTab({ params, searchParams }: PostTabsProps) {
  const query = searchParams?.query || "";
  const sortBy = searchParams?.sort || "desc";
  const isStrictSearch = searchParams?.strict === "true";
  const fromDate = searchParams?.from || "";
  const toDate = searchParams?.to || "";

  const queryString = `query=${query}&sort=${sortBy}&strict=${isStrictSearch}&from=${fromDate}&to=${toDate}&username=${params.username}`;

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto">
      <PostCardList key={Math.random()} queryString={queryString} />
    </div>
  );
}
