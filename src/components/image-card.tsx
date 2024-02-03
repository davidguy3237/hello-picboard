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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [toggleModal, setToggleModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onClick = () => {
    console.log("BUTTON CLICKED");
  };

  const openModal = () => {
    if (window.innerWidth > 768) {
      setToggleModal(true);
    }
  };

  const closeModal = () => {
    setToggleModal(false);
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
        {windowWidth > 768 && (
          <Button
            className="absolute bottom-0 right-0 hidden rounded-full group-hover:flex group-hover:items-center group-hover:justify-center"
            variant="ghost"
            size="icon"
            onClick={openModal}
          >
            {/* <ArrowUpRightFromSquare /> */}
            <Maximize />
          </Button>
        )}
      </div>
      {toggleModal && (
        <ImageModal imageUrl={imageUrl} closeModal={closeModal} />
      )}
    </div>
  );
}
