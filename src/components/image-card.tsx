"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowUpRightFromSquare, ImageIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ImageModal } from "./image-modal";

interface ImageProps {
  imageUrl: string;
}

export function ImageCard({ imageUrl }: ImageProps) {
  const [toggleModal, setToggleModal] = useState(false);

  const onClick = () => {
    console.log("BUTTON CLICKED");
  };

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  return (
    <div className="relative m-2 flex h-fit w-full items-center justify-center overflow-hidden rounded-lg bg-secondary md:h-96 md:w-80">
      {imageUrl ? (
        <div className="group h-full w-full">
          <img
            alt=""
            src={imageUrl}
            loading="lazy"
            decoding="async"
            className="h-full w-full cursor-pointer object-cover"
            onClick={openModal}
          />
          <Button
            className="absolute bottom-0 right-0 hidden hover:text-secondary group-hover:block"
            variant="link"
            onClick={onClick}
          >
            <ArrowUpRightFromSquare />
          </Button>
        </div>
      ) : (
        <ImageIcon
          className="aspect-square w-full object-cover text-muted-foreground"
          size={48}
        />
      )}
      {toggleModal && (
        <ImageModal imageUrl={imageUrl} closeModal={closeModal} />
      )}
    </div>
  );
}
