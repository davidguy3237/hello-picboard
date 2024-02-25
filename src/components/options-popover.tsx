"use client";

import { Button } from "@/components/ui/button";
import { Copy, Download, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface OptionsPopoverProps {
  sourceUrl: string;
  id: string;
}

export function OptionsPopover({ sourceUrl, id }: OptionsPopoverProps) {
  const writeURLToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_APP_URL}/post/${id}`,
      );
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) message = error.message;
      toast.error(message);
      return;
    }

    toast.success("Copied URL to clipboard");
  };

  return (
    <Popover>
      <PopoverTrigger className="invisible absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground group-hover:visible">
        <MoreHorizontal />
      </PopoverTrigger>
      <PopoverContent className="z-10 w-fit border bg-popover p-0 text-popover-foreground sm:rounded-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={writeURLToClipboard}
          className="flex justify-between active:bg-background"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy URL
        </Button>
        <Link href={sourceUrl} download>
          <Button
            variant="ghost"
            size="sm"
            className="flex justify-between active:bg-background"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </Link>
      </PopoverContent>
    </Popover>
  );
}
