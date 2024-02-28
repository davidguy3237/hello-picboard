/* eslint-disable @next/next/no-img-element */
"use client";
import { OptionsPopover } from "@/components/posts/options-popover";
import useIsWindowSmall from "@/hooks/use-is-window-small";
import Link from "next/link";
import React, { SyntheticEvent } from "react";

interface ImageProps {
  publicId: string;
  sourceUrl: string;
  thumbnailUrl: string;
}

export const PostCard = React.forwardRef<HTMLDivElement, ImageProps>(
  function PostCard({ publicId, sourceUrl, thumbnailUrl }, ref) {
    const isWindowSmall = useIsWindowSmall();

    const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = "/image.svg";
    };

    return ref ? (
      <div
        ref={ref}
        className="relative h-fit w-auto overflow-hidden bg-muted sm:h-96 sm:rounded-sm"
      >
        <div className="group h-full w-full">
          {isWindowSmall ? (
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
          ) : (
            <Link
              href={`/post/${publicId}`}
              scroll={false}
              aria-label="Open Image"
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
            sourceUrl={sourceUrl}
            publicId={publicId}
            isInvisible={true}
          />
        </div>
      </div>
    ) : (
      <div className="relative h-fit w-auto overflow-hidden bg-muted sm:h-96 sm:rounded-sm">
        <div className="group h-full w-full">
          {isWindowSmall ? (
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
          ) : (
            <Link
              href={`/post/${publicId}`}
              scroll={false}
              aria-label="Open Image"
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
            sourceUrl={sourceUrl}
            publicId={publicId}
            isInvisible={true}
          />
        </div>
      </div>
    );
  },
);
