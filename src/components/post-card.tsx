/* eslint-disable @next/next/no-img-element */
"use client";
import useIsWindowSmall from "@/hooks/use-is-window-small";
import Link from "next/link";
import { SyntheticEvent } from "react";

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

  return (
    <div className="relative m-2 flex h-fit w-full items-center justify-center overflow-hidden rounded-sm bg-secondary md:h-96 md:w-80">
      <div className="h-full w-full">
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
              className="h-full w-full cursor-pointer object-cover"
              onError={handleOnError}
            />
          </Link>
        )}
      </div>
    </div>
  );
}
