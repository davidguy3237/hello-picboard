"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowUpRightFromSquare } from "lucide-react";
import { Button } from "./ui/button";
import { SyntheticEvent } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
        <Dialog>
          <DialogTrigger asChild>
            <img
              decoding="async"
              loading="lazy"
              alt=""
              src={imageUrl}
              className="h-full w-full cursor-pointer object-cover"
              onError={handleOnError}
            />
          </DialogTrigger>
          <DialogContent className="flex h-max max-h-[90%] w-max max-w-[90%] flex-col divide-y overflow-auto xl:h-full xl:max-h-[95%] xl:flex-row xl:divide-x xl:divide-y-0">
            <img
              alt=""
              src={imageUrl}
              className=" mt-4 max-h-full max-w-full self-center object-contain xl:mt-0"
            />
            <div className="w-full flex-shrink-0 pt-2 xl:w-96 xl:pl-4 xl:pt-0">
              <h1>Header Stuff</h1>
              <p>Uploaded By</p>
              <p>Date</p>
              <p>Dimensions</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
                quis dolorum vero, optio enim quod doloribus expedita atque
                deleniti? Possimus nemo magnam quas consequatur consequuntur
                magni iure, enim et voluptate sit? Quod provident earum veniam
                neque quos, officiis illo laboriosam repudiandae placeat quis?
                Fugit tempora doloribus delectus tempore amet ullam.
              </p>
            </div>
          </DialogContent>
        </Dialog>
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
