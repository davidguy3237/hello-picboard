"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

export function NewAlbumButton() {
  // TODO: do I want to provide this as an option? not sure yet.
  return (
    <Dialog>
      <DialogTrigger className="flex h-60 w-60 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted text-muted-foreground hover:border-accent-foreground hover:bg-accent hover:text-accent-foreground">
        <PlusCircle className="h-12 w-12" />
        <p className="italic">Create an album</p>
      </DialogTrigger>
      <DialogContent>Test</DialogContent>
    </Dialog>
  );
}
