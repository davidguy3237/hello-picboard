"use client";
/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import { ArrowUpRightFromSquare } from "lucide-react";
import { Button } from "./ui/button";
import { SyntheticEvent } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useIsWindowSmall from "@/hooks/use-is-window-small";
interface ImageProps {
  imageUrl: string;
}

export function ImageCard({ imageUrl }: ImageProps) {
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
            src={imageUrl}
            height={100} // height & weight being overwritten by className
            width={100} // but having these explicitly declared enables lazy loading
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
                src={imageUrl}
                height={1} // height & weight being overwritten by className
                width={1} // but having these explicitly declared seems to enable lazy loading?
                className="h-full w-full cursor-pointer object-cover"
                onError={handleOnError}
              />
            </DialogTrigger>
            <DialogContent className="flex h-max max-h-[90%] w-max max-w-[90%] flex-col divide-y overflow-auto xl:h-full xl:max-h-[95%] xl:flex-row xl:divide-x xl:divide-y-0">
              <img
                alt=""
                src={imageUrl}
                className=" mt-4 max-h-full max-w-full self-center object-contain xl:mt-0"
                onError={handleOnError}
              />
              <div className="w-full flex-shrink-0 pt-2 xl:w-96 xl:pl-4 xl:pt-0">
                <div>
                  <p>Uploaded By: Username </p>
                  <p className="mt-4">January 01, 2023</p>
                  <p className="mt-4">Width x Height</p>
                </div>
                <div className="mt-8">
                  <p className="">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Similique accusantium, officia, maxime dignissimos maiores
                    nemo rerum architecto beatae neque animi ratione possimus,
                    nam consequuntur vero aliquam quisquam aliquid? Corrupti
                    alias est velit ut recusandae vitae totam deleniti autem?
                    Voluptatum qui rerum vitae at dicta consectetur reiciendis
                    hic doloremque eum inventore, temporibus veniam nobis enim
                    recusandae dolore explicabo incidunt perferendis quisquam.
                    Obcaecati, omnis perferendis si.
                  </p>
                </div>
                <div className="mt-8">
                  <p className="">Tags</p>
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
