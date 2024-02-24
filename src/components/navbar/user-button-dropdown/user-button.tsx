"use client";

import { DarkModeToggle } from "@/components/navbar/user-button-dropdown/dark-mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExtendedUser } from "@/next-auth";
import { Album, Images, LogOut, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserButtonProps {
  user?: ExtendedUser | undefined;
}

export function UserButton({ user }: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Profile">
        <Avatar className="mx-2" aria-label="Profile">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-foreground">
            <User className="text-background" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <Link href="/test">
          <DropdownMenuItem>
            <Images className="mr-2 h-4 w-4" />
            My Posts
          </DropdownMenuItem>
        </Link>
        <Link href="/test">
          <DropdownMenuItem>
            <Album className="mr-2 h-4 w-4" />
            My Albums
          </DropdownMenuItem>
        </Link>
        <Link href="/settings" prefetch={false}>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DarkModeToggle />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
