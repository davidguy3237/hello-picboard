/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageDisplayProps {
  sourceUrl: string;
  width: number | null;
  height: number | null;
}

export default function ImageDisplay({
  sourceUrl,
  width,
  height,
}: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useWidth, setUseWidth] = useState<boolean>(false);
  const widthToUse = width || 500;
  const heightToUse = height || 500;
  const aspectRatio = widthToUse / heightToUse;
  const maxHeight = Math.min(window.innerHeight, heightToUse);
  const maxWidth = Math.min(window.innerWidth, widthToUse);

  useEffect(() => {
    if (widthToUse > heightToUse) {
      setUseWidth(true);
    }
  }, [widthToUse, heightToUse]);

  return (
    <div
      className="relative flex max-h-[calc(100dvh-15rem)] max-w-full items-center justify-center bg-background lg:max-h-none lg:max-w-[calc(100%-20rem)]"
      style={{
        height: !useWidth && isLoading ? `${maxHeight}px` : undefined,
        width: useWidth && isLoading ? `${maxWidth}px` : undefined,
        aspectRatio: `${aspectRatio}`,
      }}
    >
      <Loader2
        className={cn(
          "absolute left-1/2 top-1/2 hidden h-10 w-10 animate-spin",
          isLoading && "block",
        )}
      />
      <img
        src={`${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${sourceUrl}`}
        alt=""
        className="max-h-[100dvh] max-w-full object-contain"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
