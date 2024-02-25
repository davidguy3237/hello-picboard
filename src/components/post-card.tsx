/* eslint-disable @next/next/no-img-element */
"use client";
import { OptionsPopover } from "@/components/options-popover";
import useIsWindowSmall from "@/hooks/use-is-window-small";
import Link from "next/link";
import React, { SyntheticEvent } from "react";

interface ImageProps {
  id: string;
  sourceUrl: string;
  thumbnailUrl: string;
}

export const PostCard = React.forwardRef<HTMLDivElement, ImageProps>(
  function PostCard({ id, sourceUrl, thumbnailUrl }, ref) {
    const isWindowSmall = useIsWindowSmall();

    const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = "/image.svg";
    };

    return ref ? (
      <div
        ref={ref}
        className="relative flex h-fit w-full flex-auto items-center justify-center overflow-hidden bg-secondary sm:rounded-sm md:h-96 md:w-72"
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
            <Link href={`/post/${id}`} scroll={false}>
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
          <OptionsPopover sourceUrl={sourceUrl} id={id} />
        </div>
      </div>
    ) : (
      <div className="relative flex h-fit w-full flex-auto items-center justify-center overflow-hidden bg-secondary sm:rounded-sm md:h-96 md:w-72">
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
            <Link href={`/post/${id}`} scroll={false}>
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
          <OptionsPopover sourceUrl={sourceUrl} id={id} />
        </div>
      </div>
    );
  },
);
