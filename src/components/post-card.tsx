/* eslint-disable @next/next/no-img-element */
"use client";
import useIsWindowSmall from "@/hooks/use-is-window-small";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Copy, Download, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { SyntheticEvent } from "react";
import { Button } from "./ui/button";
import { Popover } from "./ui/popover";
import { toast } from "sonner";

interface ImageProps {
  id: string;
  sourceUrl: string;
  thumbnailUrl: string;
}

export function PostCard({ id, sourceUrl, thumbnailUrl }: ImageProps) {
  const isWindowSmall = useIsWindowSmall();

  const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/image.svg";
  };

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
    <div className="relative flex h-fit w-full flex-auto items-center justify-center overflow-hidden rounded-sm bg-secondary md:h-96 md:w-72">
      <div className="group h-full w-full">
        {isWindowSmall ? (
          <Link href={`/post/${id}`} prefetch={false} scroll={false}>
            <img
              decoding="async"
              loading="lazy"
              alt=""
              src={sourceUrl} // Show the full image on phones
              height={384} // height & weight being overwritten by className
              width={320} // but having these explicitly declared enables lazy loading
              className="h-full w-full cursor-pointer object-cover"
              onError={handleOnError}
            />
          </Link>
        ) : (
          <Link href={`/post/${id}`} prefetch={false} scroll={false}>
            <img
              decoding="async"
              loading="lazy"
              alt=""
              src={thumbnailUrl}
              height={384} // height & weight being overwritten by className
              width={320} // but having these explicitly declared seems to enable lazy loading?
              className="peer h-full w-full cursor-pointer object-cover"
              onError={handleOnError}
            />
          </Link>
        )}
        <Popover>
          <PopoverTrigger className="invisible absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground group-hover:visible">
            <MoreHorizontal />
          </PopoverTrigger>
          <PopoverContent className="z-10 rounded-sm border bg-popover text-popover-foreground">
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
      </div>
    </div>
  );
}
