import SidebarNav from "./components/tabs-nav";
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

  return (
    <div className="flex h-[calc(100vh-57px)] w-full items-center justify-center">
      <SidebarNav username={params.username} />
      {children}
    </div>
  );
}
