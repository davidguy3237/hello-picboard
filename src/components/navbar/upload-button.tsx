"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export function UploadButton() {
  const onClick = () => {
    console.log("UPLOAD BUTTON TRIGGER");
  };

  return (
    <Link href="/upload">
      <Button
        onClick={onClick}
        variant="outline"
        size="icon"
        aria-label="Upload"
      >
        <Upload />
      </Button>
    </Link>
  );
}
