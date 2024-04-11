import { AlbumCardsList } from "@/app/(public)/user/[username]/albums/components/album-cards-list";
import db from "@/lib/db";
import { notFound } from "next/navigation";

export default async function UserAlbumsPage({
  params,
}: {
  params: { username: string };
}) {
  const dbUser = await db.user.findUnique({
    where: {
      name: decodeURIComponent(params.username),
    },
  });

  if (!dbUser) {
    notFound();
  }

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto">
      <AlbumCardsList username={params.username} userId={dbUser.id} />
    </div>
  );
}
