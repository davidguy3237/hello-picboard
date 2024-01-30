"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadButton() {
  const onClick = () => {
    console.log("UPLOAD BUTTON TRIGGER");
  };

  return (
    <Button onClick={onClick} variant="outline" size="icon">
      <Upload className="h-5 w-5" />
    </Button>
  );
}
