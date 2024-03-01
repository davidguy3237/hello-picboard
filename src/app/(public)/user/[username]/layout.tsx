import Link from "next/link";
import SidebarNav from "./components/tabs-nav";

interface UserLayoutProps {
  children: React.ReactNode;
  // tabs: React.ReactNode;
  params: {
    username: string;
  };
}

export default async function UsernameLayout({
  children,
  // tabs,
  params,
}: UserLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-57px)] w-full items-center justify-center">
      <SidebarNav username={params.username} />
      {children}
      {/* {tabs} */}
    </div>
  );
}
