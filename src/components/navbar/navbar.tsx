// "use client";

import { FilterButton } from "@/components/navbar/filter-button";
import { HomeButton } from "@/components/navbar/home-button";
import { Search } from "@/components/navbar/search";
import { ThemeToggleButton } from "@/components/navbar/theme-toggle-button";
import { UploadButton } from "@/components/navbar/upload-button";
import { UserButton } from "@/components/navbar/user-button-dropdown/user-button";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import Link from "next/link";
// TODO: change how the navbar is rendered depending on screen size

interface NavbarProps {
  showSearch?: boolean;
}

export async function Navbar({ showSearch = true }: NavbarProps) {
  const user = await currentUser();
  return (
    <nav className=" flex w-full items-center justify-between p-2">
      <div className="flex">
        <HomeButton />
      </div>
      {showSearch && (
        <div className="mx-4 flex w-full max-w-screen-sm items-center gap-x-2">
          {user && <UploadButton />}
          <Search />
          <FilterButton />
        </div>
      )}
      <div className="flex gap-x-2">
        {user ? (
          <UserButton user={user} />
        ) : (
          <>
            <ThemeToggleButton />
            <Link href="/auth/register">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
