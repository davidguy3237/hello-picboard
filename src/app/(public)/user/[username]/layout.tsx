import { SidebarNav } from "@/app/(public)/user/[username]/components/sidebar-nav";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { notFound } from "next/navigation";

interface UserLayoutProps {
  children: React.ReactNode;
  params: {
    username: string;
  };
}

export default async function UsernameLayout({
  children,
  params,
}: UserLayoutProps) {
  const user = await currentUser();
  const dbUser = await db.user.findUnique({
    where: {
      name: params.username,
    },
  });

  if (!dbUser) {
    notFound();
  }

  const sidebarNavItems = [
    {
      title: "Posts",
      href: `/user/${params.username}/posts`,
    },
    {
      title: "Albums",
      href: `/user/${params.username}/albums`,
    },
  ];

  if (user?.name === params.username) {
    sidebarNavItems.push({
      title: "Favorites",
      href: `/user/${params.username}/favorites`,
    });
  }

  return (
    <div className="flex h-[calc(100dvh-57px)] w-full items-center justify-center">
      <aside className=" h-full w-[300px]">
        <SidebarNav items={sidebarNavItems} dbUser={dbUser} />
      </aside>
      {children}
    </div>
  );
}
