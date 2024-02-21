"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

export function UploadButton() {
  return (
    <Link href="/upload" prefetch={false}>
      <Button
        variant="outline"
        // size="lg"
        aria-label="Upload"
        className="flex shrink-0 items-center justify-center gap-x-2"
      >
        <Upload size={18} />
        <span>Upload</span>
      </Button>
    </Link>
  );
}
