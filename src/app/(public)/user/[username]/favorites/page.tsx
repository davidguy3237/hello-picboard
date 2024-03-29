import { FavoritesPostCardList } from "@/components/posts/favorites-post-card-list";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

interface UserFavoritesPageProps {
  params: {
    username: string;
  };
}

export default async function UserFavoritesPage({
  params,
}: UserFavoritesPageProps) {
  const user = await currentUser();
  if (!user || user.name !== params.username) {
    redirect("/");
  }
  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto">
      <FavoritesPostCardList endpoint="/api/posts/infinite/favorites" />
    </div>
  );
}
