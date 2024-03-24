/* eslint-disable @next/next/no-img-element */
import { MemoizedImg } from "@/app/(protected)/upload/components/memoized-img";
import { CustomAsyncCreatableSelect } from "@/components/CustomAsyncCreatableSelect";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn, writeReadableFileSize } from "@/lib/utils";
import { BatchUploadSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent } from "@radix-ui/react-dialog";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { FileWithPath } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface GroupUploadProps {
  files: FileWithPath[];
  removeFile: (file: FileWithPath) => void;
  uploadedFiles: FileWithPath[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
}

export function BatchUpload({
  files,
  removeFile,
  uploadedFiles,
  setUploadedFiles,
}: GroupUploadProps) {
  const [isPending, startTransition] = useTransition();
  const [failedUploads, setFailedUploads] = useState<FileWithPath[]>([]);
  const form = useForm<z.infer<typeof BatchUploadSchema>>({
    resolver: zodResolver(BatchUploadSchema),
    defaultValues: {
      tags: [],
      description: "",
      images: [],
    },
  });

  useEffect(() => {
    form.setValue("images", files);
  }, [files, form]);

  const onSubmit = (batchUploadData: z.infer<typeof BatchUploadSchema>) => {
    startTransition(async () => {
      const promises = [];
      for (let i = 0; i < batchUploadData.images.length; i++) {
        const newPostData = new FormData();
        const image = batchUploadData.images[i];
        newPostData.append("image", image);
        newPostData.append(
          "description",
          batchUploadData.description as string,
        );
        for (let i = 0; i < batchUploadData.tags.length; i++) {
          const tag = batchUploadData.tags[i];
          newPostData.append("tags[]", tag);
        }

        promises.push(
          fetch("/api/posts/upload", {
            method: "POST",
            body: newPostData,
          }).then((response) => {
            if (!response.ok) {
              toast.error(
                `Error uploading ${image.name}: ${response.statusText}`,
              );
              setFailedUploads((prev) => [...prev, image]);
            } else {
              setUploadedFiles((prev) => [...prev, image]);
            }
          }),
        );
      }

      const results = await Promise.allSettled(promises);
    });
  };

  return (
    <div className="w-full p-2">
      <div className="border-b p-2">
        <h3 className="text-2xl font-semibold">Batch Upload</h3>
        <p className="text-sm text-muted-foreground">
          Apply the same tags and description to multiple images
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-1">
          <FormField
            control={form.control}
            name="tags"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <CustomAsyncCreatableSelect
                    onChangeFromForm={onChange}
                    disabled={
                      isPending ||
                      uploadedFiles.length > 0 ||
                      failedUploads.length > 0
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    maxLength={500}
                    disabled={
                      isPending ||
                      uploadedFiles.length > 0 ||
                      failedUploads.length > 0
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              isPending || uploadedFiles.length > 0 || failedUploads.length > 0
            }
          >
            Upload All
          </Button>
        </form>
      </Form>
      <div className=" mt-4 divide-y rounded-lg border">
        {files.map((file) => (
          <div
            key={file.name}
            className="flex items-center justify-between p-1"
          >
            <Dialog>
              <DialogTrigger className="grid h-10 w-10 cursor-zoom-in place-items-center">
                <MemoizedImg
                  file={file}
                  className="max-h-10 max-w-10 object-contain"
                />
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                  <MemoizedImg
                    file={file}
                    className="fixed left-[50%] top-[50%] z-50 h-fit max-h-[100dvh] w-auto max-w-full translate-x-[-50%] translate-y-[-50%] object-contain"
                  />
                  <DialogClose
                    className="absolute right-4 top-4 z-50 text-white"
                    aria-label="Close"
                  >
                    <X />
                  </DialogClose>
                </DialogContent>
              </DialogPortal>
            </Dialog>
            <p className="flex w-2/3 gap-1">
              <span className="truncate">{file.name}</span>
              <span> - </span>
              <span className="shrink-0">
                {writeReadableFileSize(file.size)}
              </span>
            </p>
            {isPending &&
            !uploadedFiles.includes(file) &&
            !failedUploads.includes(file) ? (
              <Loader2
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "shrink-0 animate-spin hover:bg-transparent",
                )}
              />
            ) : uploadedFiles.includes(file) ? (
              <Check
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "shrink-0 text-green-500 duration-500 animate-in fade-in zoom-in hover:bg-transparent hover:text-green-500",
                )}
              />
            ) : failedUploads.includes(file) ? (
              <X
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "shrink-0 text-destructive duration-500 animate-in fade-in zoom-in hover:bg-transparent hover:text-destructive",
                )}
              />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  removeFile(file);
                }}
                disabled={isPending}
                className="shrink-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
