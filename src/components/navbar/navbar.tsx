import { HomeButton } from "@/components/navbar/home-button";
import { Search } from "@/components/navbar/search";
import { ThemeToggleButton } from "@/components/navbar/theme-toggle-button";
import { UploadButton } from "@/components/navbar/upload-button";
import { UserButton } from "@/components/navbar/user-button-dropdown/user-button";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import Link from "next/link";

interface NavbarProps {
  showSearch?: boolean;
}
export async function Navbar({ showSearch = true }: NavbarProps) {
  const user = await currentUser();
  return (
    <nav className="sticky top-0 z-10 flex w-full items-center gap-x-2 border-b bg-background p-2">
      <div className="flex flex-1 gap-x-2 lg:min-w-fit">
        <HomeButton />
        {user && <UploadButton />}
      </div>
      {showSearch && <Search />}
      <div className="flex flex-1 justify-end gap-x-2">
        {user ? (
          <UserButton user={user} />
        ) : (
          <>
            <ThemeToggleButton />
            <Link href="/register" prefetch={false} scroll={false}>
              <Button variant="outline">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
