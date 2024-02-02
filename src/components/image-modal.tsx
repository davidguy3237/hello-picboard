/* eslint-disable @next/next/no-img-element */
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { FocusOn } from "react-focus-on";
import { createPortal } from "react-dom";

interface ImageModalProps {
  imageUrl: string;
  closeModal: Function;
}

export function ImageModal({ imageUrl, closeModal }: ImageModalProps) {
  return (
    <>
      {createPortal(
        <FocusOn onEscapeKey={() => closeModal()}>
          <div
            className="fixed inset-0 z-30 bg-black/80"
            onClick={() => closeModal()}
          >
            <div
              className="fixed left-1/2 top-1/2 flex h-full max-h-[90%] w-full max-w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center"
              onClick={() => closeModal()}
            >
              <img
                alt=""
                src={imageUrl}
                className="max-h-full max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => closeModal()}
              className="fixed right-10 top-10 rounded-full"
              aria-label="Close"
            >
              <X
                strokeWidth={3}
                size={32}
                className=" text-white"
                aria-label="Close"
              />
            </Button>
          </div>
        </FocusOn>,
        document.body,
      )}
    </>
  );
}
