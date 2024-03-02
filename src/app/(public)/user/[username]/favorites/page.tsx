import { PostCardList } from "@/components/posts/post-card-list";

export default async function UserFavoritesPage() {
  const queryString = "favorites=true";
  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto ">
      <PostCardList key={Math.random()} queryString={queryString} />
    </div>
  );
}
