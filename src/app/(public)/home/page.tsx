import { HomePageProps } from "@/app/(public)/home/types";
import { PostCardList } from "@/components/post-card-list";

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams?.query || "";
  const sortBy = searchParams?.sort || "desc";
  const isStrictSearch = searchParams?.strict === "true";
  const fromDate = searchParams?.from || "";
  const toDate = searchParams?.to || "";

  const queryString = `query=${query}&sort=${sortBy}&strict=${isStrictSearch}&from=${fromDate}&to=${toDate}`;

  return <PostCardList key={Math.random()} queryString={queryString} />;
}
