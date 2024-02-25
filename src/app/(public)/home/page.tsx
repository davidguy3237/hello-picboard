import { HomePageProps } from "@/app/(public)/home/types";
import { PostCardList } from "@/components/post-card-list";

export default async function HomePage() {
  return <PostCardList key={Math.random()} />;
}
