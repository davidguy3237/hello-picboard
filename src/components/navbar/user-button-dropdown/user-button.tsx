"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { DarkModeToggle } from "@/components/navbar/user-button-dropdown/dark-mode-toggle";
import { SettingsButton } from "@/components/navbar/user-button-dropdown/settings-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExtendedUser } from "@/next-auth";
import { LogOut, User } from "lucide-react";

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
        <SettingsButton />
        <DarkModeToggle />
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
