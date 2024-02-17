"use client";
/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useIsWindowSmall from "@/hooks/use-is-window-small";
import { ArrowUpRightFromSquare } from "lucide-react";
import { SyntheticEvent } from "react";
interface ImageProps {
  userId: string;
  username: string;
  sourceUrl: string;
  thumbnailUrl: string;
  description: string;
  createdAt: Date;
  tags: { name: string }[];
}

export function ImageCard({
  sourceUrl,
  thumbnailUrl,
  description,
  createdAt,
  username,
  userId,
  tags,
}: ImageProps) {
  const isWindowSmall = useIsWindowSmall();

  const onClick = () => {
    console.log("BUTTON CLICKED");
  };

  const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/image.svg";
  };

  return (
    <div className="relative m-2 flex h-fit w-full items-center justify-center overflow-hidden rounded-sm bg-secondary md:h-96 md:w-80">
      <div className="group h-full w-full">
        {isWindowSmall ? (
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
        ) : (
          <Dialog>
            <DialogTrigger asChild>
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
            </DialogTrigger>
            <DialogContent className="flex h-max max-h-[90%] w-max max-w-[90%] flex-col divide-y overflow-auto xl:h-full xl:max-h-[95%] xl:flex-row xl:divide-x xl:divide-y-0">
              <img
                alt=""
                src={sourceUrl}
                className=" mt-4 max-h-full max-w-full self-center object-contain xl:mt-0"
                onError={handleOnError}
              />
              <div className="w-full flex-shrink-0 pt-2 xl:w-96 xl:pl-4 xl:pt-0">
                <div>
                  <p>Uploaded By: {username} </p>
                  <p className="mt-4">
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="mt-8">
                  <p className="">{description}</p>
                </div>
                <div className="mt-8 flex gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.name}
                      variant="secondary"
                      className="hover:cursor-pointer"
                      onClick={onClick}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button
          className="absolute bottom-0 right-0 hidden rounded-full text-white xl:group-hover:flex xl:group-hover:items-center xl:group-hover:justify-center"
          variant="ghost"
          size="icon"
          onClick={onClick}
        >
          <ArrowUpRightFromSquare />
        </Button>
      </div>
    </div>
  );
}
