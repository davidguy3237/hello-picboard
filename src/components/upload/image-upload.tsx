/* eslint-disable @next/next/no-img-element */
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UploadForm } from "@/components/upload/upload-form";
import { cn } from "@/lib/utils";
import { ImagePlus } from "lucide-react";
import { useCallback } from "react";
import {
  DropEvent,
  ErrorCode,
  FileError,
  FileRejection,
  FileWithPath,
  useDropzone,
} from "react-dropzone";
import { toast } from "sonner";

export function ImageUpload() {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.map((file: FileRejection) => {
          toast.error(file.errors[0].message);
        });
      }
    },
    [],
  );

  const validateFile = (file: File) => {
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return {
        code: "file-invalid-type",
        message: "JPG, JPEG, or PNG files only",
      };
    }
    if (file.size > 1024 * 1024 * 4) {
      return {
        code: "size-too-large",
        message: "Image must be 4MB or smaller",
      };
    }
    return null;
  };

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    onDrop,
    maxFiles: 10,
    validator: validateFile,
  });

  const filesPreview = acceptedFiles.map((file: FileWithPath) => {
    return <UploadForm key={file.path} file={file} />;
  });

  return acceptedFiles.length > 0 ? (
    <div className="my-4 flex w-full max-w-screen-md flex-col items-center justify-start gap-4">
      {filesPreview}
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="flex h-1/2 w-full max-w-screen-lg cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground text-muted-foreground hover:bg-muted">
        <CardContent
          className={cn(
            "h-full w-full",
            isDragAccept && "bg-muted",
            isDragReject && "bg-destructive",
          )}
        >
          <div {...getRootProps()} className="h-full w-full">
            <input {...getInputProps()} />
            <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 text-xl">
              <ImagePlus size={80} />
              <p>
                <span className="cursor-pointer font-bold hover:underline">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p>up to 10 images (JPG or PNG only), 4MB per file</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
