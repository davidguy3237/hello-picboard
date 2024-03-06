import SidebarNav from "@/app/(public)/user/[username]/components/sidebar-nav";
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
  console.log("USER LAYOUT");
  const user = await db.user.findUnique({
    where: {
      name: params.username,
    },
  });

  if (!user) {
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
    {
      title: "Favorites",
      href: `/user/${params.username}/favorites`,
    },
  ];

  return (
    <div className="flex h-[calc(100vh-57px)] w-full items-center justify-center">
      <aside className=" h-full w-[300px]">
        <SidebarNav items={sidebarNavItems} />
      </aside>
      {children}
    </div>
  );
}
