/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { memo } from "react";
import { FileWithPath } from "react-dropzone";

export const MemoizedImg = memo(function MemoizedImg({
  file,
  className,
}: {
  file: FileWithPath;
  className?: string;
}) {
  return (
    <img alt="" src={URL.createObjectURL(file)} className={cn(className)} />
  );
});
