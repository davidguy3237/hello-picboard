"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { UserButton } from "@/components/user-dropdown/user-button";
import { HomeButton } from "@/components/navbar/home-button";
import { UploadButton } from "@/components/navbar/upload-button";
import { SearchBar } from "@/components/navbar/search-bar";

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 z-10 flex w-full items-center justify-between bg-secondary p-2">
      <div className="flex">
        <HomeButton />
        <UploadButton />
      </div>
      <div>
        <SearchBar />
      </div>
      {/* <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/server" ? "default" : "outline"}
        >
          <Link href="/server">Server</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/client" ? "default" : "outline"}
        >
          <Link href="/client">Client</Link>
        </Button>
        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div> */}
      <UserButton />
    </nav>
  );
}
