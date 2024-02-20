/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Maximize, X } from "lucide-react";
import { createPortal } from "react-dom";
import { FocusOn } from "react-focus-on";

interface ImageModalProps {
  imageUrl: string;
  // closeModal: Function;
  // windowWidth: number;
}

export function ImageModal({ imageUrl }: ImageModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="absolute bottom-0 right-0 hidden rounded-full text-white xl:group-hover:flex xl:group-hover:items-center xl:group-hover:justify-center"
          variant="ghost"
          size="icon"
        >
          <Maximize />
        </Button>
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quis
            dolorum vero, optio enim quod doloribus expedita atque deleniti?
            Possimus nemo magnam quas consequatur consequuntur magni iure, enim
            et voluptate sit? Quod provident earum veniam neque quos, officiis
            illo laboriosam repudiandae placeat quis? Fugit tempora doloribus
            delectus tempore amet ullam.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
// Alternate modal setup, keep just in case
// return (
//   <>
//     {createPortal(
//       <FocusOn onEscapeKey={() => closeModal()}>
//         <div
//           className="fixed inset-0 z-30 bg-black/80"
//           onClick={() => closeModal()}
//         >
//           <div
//             className="fixed left-1/2 top-1/2 flex h-full max-h-[90%] w-full max-w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center"
//             onClick={() => closeModal()}
//           >
//             <img
//               alt=""
//               src={imageUrl}
//               className="max-h-full max-w-full object-contain"
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => closeModal()}
//             className="fixed right-4 top-4 rounded-full"
//             aria-label="Close"
//           >
//             <X size={32} className=" text-white" aria-label="Close" />
//           </Button>
//         </div>
//       </FocusOn>,
//       document.body,
//     )}
//   </>
// );
