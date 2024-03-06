"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  items: { title: string; href: string }[];
}

export default function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();
  console.log("the pathname: ", pathname);
  return (
    <nav className="flex h-full min-w-40 flex-col space-y-2 border-r p-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname.includes(item.href)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
