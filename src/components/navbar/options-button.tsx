"use client";

import { BookText, EllipsisVertical, MessageSquareWarning } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DarkModeToggle } from "./user-button-dropdown/dark-mode-toggle";

export function OptionsButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 p-0">
          <EllipsisVertical size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <Link href="/guidelines" prefetch={false} target="_blank">
          <DropdownMenuItem>
            <BookText className="mr-2 h-4 w-4" />
            Content Guidelines
          </DropdownMenuItem>
        </Link>
        <Link href="/feedback" prefetch={false}>
          <DropdownMenuItem>
            <MessageSquareWarning className="mr-2 h-4 w-4" />
            Send Feedback
          </DropdownMenuItem>
        </Link>
        <Link
          href="https://github.com/davidguy3237/hello-picboard"
          prefetch={false}
          target="_blank"
        >
          <DropdownMenuItem>
            <FaGithub className="mr-2 h-4 w-4" />
            GitHub
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DarkModeToggle />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
