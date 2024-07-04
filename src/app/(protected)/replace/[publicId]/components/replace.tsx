"use client";
import { replace } from "@/actions/replace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { toast } from "sonner";

/* eslint-disable @next/next/no-img-element */
export function ReplaceForm({ post }) {
  const [newImage, setNewImage] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("image", newImage);
      formData.append("publicId", post.publicId);

      const replaceResponse = await replace(formData);
      if (replaceResponse.error) {
        toast.error(replaceResponse.error);
      } else if (replaceResponse.success) {
        toast.success(replaceResponse.success);
      }
    });
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <span>ORIGINAL</span>
        <img
          alt=""
          src={`${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${post.sourceUrl}`}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      {newImage && <img alt="" src={URL.createObjectURL(newImage)} />}
      <Input type="file" onChange={(e) => setNewImage(e.target.files[0])} />
      <Button onClick={handleClick} disabled={isPending}>
        Replace
      </Button>
    </div>
  );
}
