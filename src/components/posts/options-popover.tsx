"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useCurrentUser from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { Copy, Download, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { SaveToAlbumModal } from "./save-to-album-modal";

interface OptionsPopoverProps {
  postId: string;
  userId: string;
  sourceUrl: string;
  publicId: string;
  isInvisible?: boolean;
  classNames?: string;
}

export function OptionsPopover({
  postId,
  userId,
  sourceUrl,
  publicId,
  isInvisible,
  classNames,
}: OptionsPopoverProps) {
  const currentUser = useCurrentUser();
  const writeURLToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_APP_URL}/post/${publicId}`,
      );
      toast.success("Copied URL to clipboard!");
      return;
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) message = error.message;
      toast.error(message);
      return;
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-accent hover:text-accent-foreground",
          isInvisible && "invisible group-hover:visible",
          classNames,
        )}
      >
        <MoreHorizontal />
      </PopoverTrigger>
      <PopoverContent className="z-50 w-fit border bg-popover p-0 text-popover-foreground sm:rounded-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={writeURLToClipboard}
          className="flex w-full justify-between active:bg-background"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy URL
        </Button>
        <a href={sourceUrl} target="_blank" download>
          <Button
            variant="ghost"
            size="sm"
            className="flex w-full justify-between active:bg-background"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </a>
        <SaveToAlbumModal postId={postId} />
        {userId === currentUser?.id && (
          <Link href={`/edit/${publicId}`} prefetch={false}>
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full justify-between active:bg-background"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        )}
      </PopoverContent>
    </Popover>
  );
}
