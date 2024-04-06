/* eslint-disable @next/next/no-img-element */
import { CategorySelect } from "@/components/category-select";
import { CustomAsyncCreatableSelect } from "@/components/custom-async-creatable-select";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn, writeReadableFileSize } from "@/lib/utils";
import { UploadSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent } from "@radix-ui/react-dialog";
import { CheckCircle, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { FileWithPath } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface UploadFormProps {
  file: FileWithPath;
  removeFile: (file: FileWithPath) => void;
  setUploadedFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
}

export function UploadForm({
  file,
  removeFile,
  setUploadedFiles,
}: UploadFormProps) {
  const [isPending, startTransition] = useTransition();
  const [postUrl, setPostUrl] = useState<string>("");
  const [blobUrl, setBlobUrl] = useState(URL.createObjectURL(file));

  const form = useForm<z.infer<typeof UploadSchema>>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      tags: [],
      description: "",
      originUrl: "",
      image: file,
    },
  });

  const onSubmit = (uploadData: z.infer<typeof UploadSchema>) => {
    startTransition(async () => {
      const newPostData = new FormData();
      newPostData.append("image", file);
      newPostData.append("description", uploadData.description as string);
      for (let i = 0; i < uploadData.tags.length; i++) {
        newPostData.append("tags[]", uploadData.tags[i]);
      }
      newPostData.append("category", uploadData.category);
      newPostData.append("originUrl", uploadData.originUrl as string);
      const response = await fetch("/api/posts/upload", {
        method: "POST",
        body: newPostData,
      });

      if (!response.ok) {
        toast.error(
          `Something went wrong uploading ${file.name}. Please try again later.`,
        );
      } else {
        const data = await response.json();
        setUploadedFiles((prev) => [...prev, file]);
        setPostUrl(data.postUrl);
      }
    });
  };

  return (
    <div className="relative w-full py-2">
      {(isPending || !!postUrl) && (
        <div
          className={cn(
            "absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
          )}
        >
          {isPending ? (
            <Loader2 size={48} className="animate-spin" />
          ) : !!postUrl ? (
            <div className="flex flex-col items-center justify-center">
              <CheckCircle
                size={48}
                className=" text-green-500 duration-500 animate-in fade-in zoom-in"
              />
              <Link target="_blank" href={postUrl} className="hover:underline">
                Click here to visit your new post
              </Link>
            </div>
          ) : null}
        </div>
      )}
      <div
        className={cn(
          "flex",
          (isPending || !!postUrl) && "select-none blur-sm",
        )}
      >
        <Dialog>
          <DialogTrigger
            className={cn(
              "grid basis-1/4 cursor-zoom-in place-items-center px-1 disabled:cursor-auto",
            )}
            disabled={isPending || !!postUrl}
          >
            <img
              alt=""
              src={blobUrl}
              className="max-h-full max-w-full object-contain"
            />
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <img
                alt=""
                src={blobUrl}
                className="fixed left-[50%] top-[50%] z-50 h-fit max-h-[100dvh] w-auto max-w-full translate-x-[-50%] translate-y-[-50%] object-contain"
              />
              <DialogClose
                className="fixed right-4 top-4 z-50 text-white"
                aria-label="Close"
              >
                <X />
              </DialogClose>
            </DialogContent>
          </DialogPortal>
        </Dialog>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full basis-3/4 flex-col gap-y-1 border-l pl-1"
          >
            <div className="flex w-11/12 items-center">
              <span className="max-w-3/4 truncate">{file.name}</span>
              <span>&nbsp;-&nbsp;</span>
              <span className="shrink-0">
                {writeReadableFileSize(file.size)}
              </span>
            </div>
            <FormField
              control={form.control}
              name="tags"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <CustomAsyncCreatableSelect
                      onChangeFromForm={onChange}
                      disabled={isPending || !!postUrl}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategorySelect
                      disabled={isPending || !!postUrl}
                      onChangeFromForm={onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source URL (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending || !!postUrl}
                      placeholder="Link to the post or article the image came from"
                      type="url"
                      className="disabled:cursor-auto disabled:select-none"
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
                      disabled={isPending || !!postUrl}
                      className="disabled:cursor-auto disabled:select-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending || !!postUrl}>
              Submit
            </Button>
          </form>
        </Form>
        <Button
          disabled={isPending || !!postUrl}
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 rounded-full"
          onClick={() => removeFile(file)}
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
