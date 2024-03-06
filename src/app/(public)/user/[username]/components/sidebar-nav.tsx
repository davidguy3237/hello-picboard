"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  items: { title: string; href: string }[];
  dbUser: User;
}

export default function SidebarNav({ items, dbUser }: SidebarNavProps) {
  const pathname = usePathname();
  return (
    <nav className="flex h-full min-w-40 flex-col space-y-2 border-r p-2">
      <div className="flex items-center gap-2">
        <Avatar className="mx-2" aria-label="Profile">
          <AvatarImage src={dbUser?.image || ""} />
          <AvatarFallback className="bg-foreground">
            <UserIcon className="text-background" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{dbUser?.name}</span>
      </div>
      <Separator />
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
