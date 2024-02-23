"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

export function UploadButton() {
  return (
    <Link href="/upload" prefetch={false}>
      <Button
        variant="outline"
        aria-label="Upload"
        className="flex h-10 w-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-0 py-0 active:bg-background lg:w-auto lg:px-2"
      >
        <Upload size={18} />
        <span className="hidden lg:block">Upload</span>
      </Button>
    </Link>
  );
}
