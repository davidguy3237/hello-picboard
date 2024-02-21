"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import Link from "next/link";
export function SettingsButton() {
  return (
    <Link href="/settings" prefetch={false}>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </DropdownMenuItem>
    </Link>
  );
}
