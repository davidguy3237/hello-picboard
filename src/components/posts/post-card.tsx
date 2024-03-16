/* eslint-disable @next/next/no-img-element */
"use client";
import { OptionsPopover } from "@/components/posts/options-popover";
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
    const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = "/image.svg";
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-56 overflow-hidden bg-muted sm:h-96 sm:rounded-sm",
          expandView && "sm:h-56",
        )}
      >
        <div className="group h-full w-full">
          <a href={`/post/${publicId}`} className=" md:hidden">
            <img
              decoding="async"
              loading="lazy"
              alt=""
              src={`${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${thumbnailUrl}`} // Show the full image on phones
              height={384} // height & weight being overwritten by className
              width={320} // but having these explicitly declared enables lazy loading
              className="h-full w-full cursor-pointer object-cover"
              onError={handleOnError}
            />
          </a>
          <Link
            href={`/post/${publicId}`}
            scroll={false}
            aria-label="Open Image Modal"
            className="hidden md:inline"
          >
            <img
              decoding="async"
              loading="lazy"
              alt=""
              src={`${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${thumbnailUrl}`}
              height={384} // height & weight being overwritten by className
              width={320} // but having these explicitly declared seems to enable lazy loading?
              className="peer h-full w-full cursor-pointer object-cover"
              onError={handleOnError}
            />
          </Link>
          <OptionsPopover
            postId={id}
            userId={userId}
            publicId={publicId}
            isInvisible={true}
            classNames="text-white hidden md:flex"
          />
        </div>
      </div>
    );
  },
);
