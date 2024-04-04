// import { HomePageProps } from "@/app/(public)/home/types";
import { PostCardList } from "@/components/posts/post-card-list";

interface HomePageProps {
  searchParams?: {
    query?: string;
    page?: string;
    sort?: "asc" | "desc";
    count?: string;
    strict?: string;
    from?: string;
    to?: string;
    category?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams?.query || "";
  const sortBy = searchParams?.sort || "desc";
  const isStrictSearch = searchParams?.strict === "true";
  const fromDate = searchParams?.from || "";
  const toDate = searchParams?.to || "";
  const category = searchParams?.category || "";

  const queryString = `query=${query}&sort=${sortBy}&strict=${isStrictSearch}&from=${fromDate}&to=${toDate}&category=${category}`;

  return <PostCardList key={Math.random()} queryString={queryString} />;
}
