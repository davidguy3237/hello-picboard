import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const writeReadableFileSize = (fileSize: number) => {
  if (fileSize < 1024) {
    return `${fileSize} Bytes`;
  }

  if (fileSize < 1024 * 1024) {
    const sizeInKB = (fileSize / 1024).toFixed(2);
    return sizeInKB + " KB";
  }

  const sizeInMB = (fileSize / 1024 / 1024).toFixed(2);
  return sizeInMB + " MB";
};
