"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  username: string;
}

export default function SidebarNav({ username }: SidebarNavProps) {
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop();
  return (
    <div className="flex h-full min-w-40 flex-col border-r">
      <Link
        href={`/user/${username}/posts`}
        className={cn(
          "w-full p-4 hover:bg-accent hover:text-accent-foreground",
          currentTab === "posts" && "bg-accent text-accent-foreground",
        )}
      >
        Posts
      </Link>
      <Link
        href={`/user/${username}/albums`}
        className={cn(
          "w-full p-4 hover:bg-accent hover:text-accent-foreground",
          currentTab === "albums" && "bg-accent text-accent-foreground",
        )}
      >
        Albums
      </Link>
      <Link
        href={`/user/${username}/favorites`}
        className={cn(
          "w-full p-4 hover:bg-accent hover:text-accent-foreground",
          currentTab === "favorites" && "bg-accent text-accent-foreground",
        )}
      >
        Favorites
      </Link>
    </div>
  );
}
