import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const writeReadableFileSize = (fileSize: number) => {
  // <1KB
  if (fileSize / 1024 < 1) {
    return `${fileSize} Bytes`;
  }

  // <1MB
  if (fileSize / 1024 / 1024 < 1) {
    const sizeInKB = (fileSize / 1024).toFixed(2);
    return sizeInKB + " KB";
  }

  const sizeInMB = (fileSize / 1024 / 1024).toFixed(2);
  return sizeInMB + " MB";
};
