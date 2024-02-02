"use client";

import { Settings } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
export function SettingsButton() {
  return (
    <Link href="/settings">
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </DropdownMenuItem>
    </Link>
  );
}
