import db from "@/lib/db";
import { AlbumCardsList } from "./components/album-cards-list";
import { notFound } from "next/navigation";

export default async function UserAlbumsPage({
  params,
}: {
  params: { username: string };
}) {
  const dbUser = await db.user.findUnique({
    where: {
      name: params.username,
    },
  });

  if (!dbUser) {
    notFound();
  }

  return (
    <div className="flex h-full w-full flex-wrap content-start gap-4 p-4">
      <AlbumCardsList username={params.username} userId={dbUser.id} />
    </div>
  );
}
