"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowUpRightFromSquare, Maximize } from "lucide-react";
import { Button } from "./ui/button";
import { SyntheticEvent, useEffect, useState } from "react";
import { ImageModal } from "./image-modal";
interface ImageProps {
  imageUrl: string;
}

export function ImageCard({ imageUrl }: ImageProps) {
  const onClick = () => {
    console.log("BUTTON CLICKED");
  };

  const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/image.svg";
  };

  return (
    <div className="relative m-1 flex h-fit w-full items-center justify-center overflow-hidden rounded-sm bg-secondary md:h-96 md:w-80">
      <div className="group h-full w-full">
        <img
          decoding="async"
          loading="lazy"
          alt=""
          src={imageUrl}
          className="h-full w-full cursor-pointer object-cover"
          onClick={onClick}
          onError={handleOnError}
        />
        <ImageModal imageUrl={imageUrl} />
      </div>
    </div>
  );
}
