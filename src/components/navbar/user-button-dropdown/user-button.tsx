"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import useCurrentUser from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { SettingsButton } from "@/components/navbar/user-button-dropdown/settings-button";

export function UserButton() {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Profile">
        <Avatar className="mx-2" aria-label="Profile">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-sky-500">
            <User className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <SettingsButton />
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
