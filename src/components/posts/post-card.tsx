/* eslint-disable @next/next/no-img-element */
"use client";
import { OptionsPopover } from "@/components/posts/options-popover";
import useIsWindowSmall from "@/hooks/use-is-window-small";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { SyntheticEvent } from "react";

interface PostProps {
  id: string;
  userId: string;
  publicId: string;
  sourceUrl: string;
  thumbnailUrl: string;
  expandView: boolean;
}

export const PostCard = React.forwardRef<HTMLDivElement, PostProps>(
  function PostCard(
    { id, userId, publicId, sourceUrl, thumbnailUrl, expandView },
    ref,
  ) {
    const isWindowSmall = useIsWindowSmall();

    const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = "/image.svg";
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-fit overflow-hidden bg-muted sm:h-96 sm:rounded-sm",
          expandView && "sm:h-56",
        )}
      >
        <div className="group h-full w-full">
          {isWindowSmall ? (
            <a href={`/post/${publicId}`}>
              <img
                decoding="async"
                loading="lazy"
                alt=""
                src={sourceUrl} // Show the full image on phones
                height={384} // height & weight being overwritten by className
                width={320} // but having these explicitly declared enables lazy loading
                className="h-full w-full object-cover"
                onError={handleOnError}
              />
            </a>
          ) : (
            <Link
              href={`/post/${publicId}`}
              scroll={false}
              aria-label="Open Image Modal"
            >
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
          <OptionsPopover
            postId={id}
            userId={userId}
            publicId={publicId}
            isInvisible={true}
            classNames="text-white"
          />
        </div>
      </div>
    );
  },
);
