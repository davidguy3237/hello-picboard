"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

export function UploadButton() {
  return (
    <Link href="/upload">
      <Button
        variant="outline"
        size="icon"
        aria-label="Upload"
        className="shrink-0"
      >
        <Upload />
      </Button>
    </Link>
  );
}
