/* eslint-disable @next/next/no-img-element */
"use client";
import { OptionsPopover } from "@/components/posts/options-popover";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { SyntheticEvent } from "react";
import { Checkbox } from "../ui/checkbox";

interface PostProps {
  id: string;
  userId: string;
  publicId: string;
  sourceUrl: string;
  thumbnailUrl: string;
  expandView: boolean;
  toggleSelectDelete?: boolean;
  postsToDelete?: string[];
  setPostsToDelete?: React.Dispatch<React.SetStateAction<string[]>>;
  setSourceUrlsToDelete?: React.Dispatch<React.SetStateAction<string[]>>;
  setThumbnailUrlsToDelete?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const PostCard = React.forwardRef<HTMLDivElement, PostProps>(
  function PostCard(
    {
      id,
      userId,
      publicId,
      sourceUrl,
      thumbnailUrl,
      expandView,
      toggleSelectDelete,
      postsToDelete,
      setPostsToDelete,
      setSourceUrlsToDelete,
      setThumbnailUrlsToDelete,
    },
    ref,
  ) {
    const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = "/image.svg";
    };

    const handleCheckedChange = (checked: boolean | "indeterminate") => {
      if (checked === true) {
        if (
          setPostsToDelete &&
          setSourceUrlsToDelete &&
          setThumbnailUrlsToDelete
        ) {
          setPostsToDelete((prev) => [...prev, id]);
          setSourceUrlsToDelete((prev) => [...prev, sourceUrl]);
          setThumbnailUrlsToDelete((prev) => [...prev, thumbnailUrl]);
        }
      } else if (checked === false) {
        if (
          setPostsToDelete &&
          setSourceUrlsToDelete &&
          setThumbnailUrlsToDelete
        ) {
          setPostsToDelete((prev) => prev.filter((postId) => postId !== id));
          setSourceUrlsToDelete((prev) =>
            prev.filter((url) => url !== sourceUrl),
          );
          setThumbnailUrlsToDelete((prev) =>
            prev.filter((url) => url !== thumbnailUrl),
          );
        }
      }
    };

    if (toggleSelectDelete) {
      return (
        <div
          ref={ref}
          className={cn(
            "relative h-32 overflow-hidden bg-muted md:h-60 md:rounded-sm lg:h-96",
            expandView && "md:h-32 lg:h-56",
          )}
        >
          <div className="group h-full w-full">
            <img
              decoding="async"
              alt=""
              src={`${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${thumbnailUrl}`} // Show the full image on phones
              height={384} // height & weight being overwritten by className
              width={320} // but having these explicitly declared enables lazy loading
              className={cn(
                "h-full w-full cursor-pointer object-cover md:hidden",
                toggleSelectDelete && "cursor-auto",
                postsToDelete?.includes(id) && "opacity-25",
              )}
              onError={handleOnError}
            />
            <img
              decoding="async"
              alt=""
              src={`${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${thumbnailUrl}`}
              height={384} // height & weight being overwritten by className
              width={320} // but having these explicitly declared seems to enable lazy loading?
              className={cn(
                "peer h-full w-full cursor-pointer object-cover",
                toggleSelectDelete && "cursor-auto",
                postsToDelete?.includes(id) && "opacity-25",
              )}
              onError={handleOnError}
            />
            <Checkbox
              onCheckedChange={handleCheckedChange}
              className="absolute left-2 top-2 bg-background"
            />
          </div>
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-32 overflow-hidden bg-muted md:h-60 md:rounded-sm lg:h-96",
          expandView && "md:h-32 lg:h-56",
        )}
      >
        <div className="group h-full w-full">
          <a href={`/post/${publicId}`} className=" md:hidden">
            <img
              decoding="async"
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
            sourceUrl={sourceUrl}
            isInvisible={true}
            classNames="text-white hidden md:flex"
          />
        </div>
      </div>
    );
  },
);
