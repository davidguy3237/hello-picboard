// "use client";

import { UserButton } from "@/components/navbar/user-button-dropdown/user-button";
import { HomeButton } from "@/components/navbar/home-button";
import { UploadButton } from "@/components/navbar/upload-button";
import { SearchBar } from "@/components/navbar/search-bar";
import { ModeToggle } from "../light-dark-toggle";
// TODO: change how the navbar is rendered depending on screen size
export function Navbar() {
  return (
    <nav className=" flex w-full items-center justify-between border-b bg-secondary p-2">
      <div className="flex">
        <HomeButton />
      </div>
      <div className="mx-4 flex w-full max-w-screen-sm items-center">
        <UploadButton />
        <SearchBar />
      </div>
      <div className="flex">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  );
}
