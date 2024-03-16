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

export function SidebarNav({ items, dbUser }: SidebarNavProps) {
  const pathname = usePathname();

  const avatarImageUrl = dbUser?.image?.includes("avatars/")
    ? `${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${dbUser.image}`
    : dbUser?.image;

  return (
    <nav className="flex h-full min-w-40 flex-col space-y-2 p-2 md:border-r">
      <div className="flex items-center gap-2">
        <Avatar className="mx-2" aria-label="Profile">
          <AvatarImage src={avatarImageUrl || ""} />
          <AvatarFallback className="bg-foreground">
            <UserIcon className="text-background" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{dbUser?.name}</span>
      </div>
      <Separator className="hidden md:block" />
      <div className="flex w-full justify-around md:flex-col">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "justify-start text-muted-foreground md:text-foreground",
              pathname.includes(item.href)
                ? " text-foreground underline underline-offset-4 hover:bg-transparent md:bg-muted md:no-underline md:hover:bg-accent"
                : "hover:bg-transparent hover:underline hover:underline-offset-4",
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
