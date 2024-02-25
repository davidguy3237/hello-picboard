"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function UploadButton() {
  const pathname = usePathname();

  if (pathname === "/upload") {
    return null;
  }
  return (
    <Link href="/upload" prefetch={false}>
      <Button
        variant="outline"
        aria-label="Upload"
        className=" h-10 w-10 shrink-0 items-center justify-center p-0 active:bg-background lg:w-auto lg:space-x-2 lg:p-2"
      >
        <Upload size={18} />
        <span className="hidden lg:block">Upload</span>
      </Button>
    </Link>
  );
}
