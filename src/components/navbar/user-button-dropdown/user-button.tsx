"use client";

import { DarkModeToggle } from "@/components/navbar/user-button-dropdown/dark-mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExtendedUser } from "@/next-auth";
import {
  Album,
  Heart,
  Images,
  LockKeyhole,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserButtonProps {
  user?: ExtendedUser | undefined;
}

export function UserButton({ user }: UserButtonProps) {
  if (!user) {
    return null;
  }

  const avatarImageUrl = user.image?.includes("avatars/")
    ? `${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${user.image}`
    : user.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Profile">
        <Avatar className="mx-2" aria-label="Profile">
          <AvatarImage src={avatarImageUrl || ""} alt="Avatar Icon" />
          <AvatarFallback className="bg-foreground">
            <User className="text-background" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>
          <div className="font-medium">{user.name}</div>
          <div className="truncate text-sm text-muted-foreground">
            {user.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/user/${user?.name}/posts`}>
          <DropdownMenuItem>
            <Images className="mr-2 h-4 w-4" />
            My Posts
          </DropdownMenuItem>
        </Link>
        <Link href={`/user/${user?.name}/albums`}>
          <DropdownMenuItem>
            <Album className="mr-2 h-4 w-4" />
            My Albums
          </DropdownMenuItem>
        </Link>
        <Link href={`/user/${user?.name}/favorites`}>
          <DropdownMenuItem>
            <Heart className="mr-2 h-4 w-4" />
            My Favorites
          </DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DarkModeToggle />
        {user.role === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <Link href={`/admin`}>
              <DropdownMenuItem>
                <LockKeyhole className="mr-2 h-4 w-4" />
                Admin Page
              </DropdownMenuItem>
            </Link>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
