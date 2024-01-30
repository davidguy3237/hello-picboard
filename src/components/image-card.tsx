import { ImageIcon } from "lucide-react";

export function ImageCard() {
  return (
    <div className="relative m-4 flex h-96 w-96 items-center justify-center overflow-hidden rounded-lg bg-secondary">
      <ImageIcon className="aspect-square w-full object-cover" size={48} />
    </div>
  );
}
