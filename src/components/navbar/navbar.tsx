// "use client";

import { ModeToggle } from "@/components/light-dark-toggle";
import { HomeButton } from "@/components/navbar/home-button";
import { Search } from "@/components/navbar/search";
import { UploadButton } from "@/components/navbar/upload-button";
import { UserButton } from "@/components/navbar/user-button-dropdown/user-button";
// TODO: change how the navbar is rendered depending on screen size
export async function Navbar() {
  return (
    <nav className=" flex w-full items-center justify-between p-2">
      <div className="flex">
        <HomeButton />
      </div>
      <div className="mx-4 flex w-full max-w-screen-sm items-center">
        <UploadButton />
        <Search />
      </div>
      <div className="flex">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  );
}
