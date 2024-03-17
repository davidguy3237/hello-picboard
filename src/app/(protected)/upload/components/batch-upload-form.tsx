/* eslint-disable @next/next/no-img-element */
import { newPost } from "@/actions/posts";
import { searchTags } from "@/actions/search-tags";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useDebounceFunction } from "@/hooks/use-debounce";
import { cn, writeReadableFileSize } from "@/lib/utils";
import { GroupUploadSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent } from "@radix-ui/react-dialog";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { FileWithPath } from "react-dropzone";
import { useForm } from "react-hook-form";
import AsyncCreatableSelect from "react-select/async-creatable";
import { toast } from "sonner";
import * as z from "zod";
import { MemoizedImg } from "./memoized-img";

interface GroupUploadProps {
  files: FileWithPath[];
  removeFile: (file: FileWithPath) => void;
  uploadedFiles: FileWithPath[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
  setRenderBatchUpload: React.Dispatch<React.SetStateAction<boolean>>;
}
interface TagOption {
  value: string;
  label: string;
}

export function BatchUpload({
  files,
  removeFile,
  uploadedFiles,
  setUploadedFiles,
  setRenderBatchUpload,
}: GroupUploadProps) {
  const [isPending, startTransition] = useTransition();
  const [failedUploads, setFailedUploads] = useState<FileWithPath[]>([]);
  const form = useForm<z.infer<typeof GroupUploadSchema>>({
    resolver: zodResolver(GroupUploadSchema),
    defaultValues: {
      tags: [],
      description: "",
      images: [],
    },
  });

  useEffect(() => {
    form.setValue("images", files);
  }, [files, form]);

  const fetchOptionsCallback = (
    inputValue: string,
    callback: (options: TagOption[]) => void,
  ) => {
    if (inputValue.length >= 3 && inputValue.length <= 40) {
      searchTags(inputValue).then((data) => {
        if (data.error) {
          callback([]);
        } else if (data.success) {
          callback(data.success);
        }
      });
    } else {
      callback([]);
    }
  };

  const debouncedFetchOptions = useDebounceFunction(fetchOptionsCallback, 300);

  const onSubmit = (batchUploadData: z.infer<typeof GroupUploadSchema>) => {
    startTransition(async () => {
      for (let i = 0; i < batchUploadData.images.length; i++) {
        const image = batchUploadData.images[i];
        const newPostData = new FormData();
        newPostData.append("image", image);
        newPostData.append(
          "description",
          batchUploadData.description as string,
        );
        for (let i = 0; i < batchUploadData.tags.length; i++) {
          newPostData.append("tags[]", batchUploadData.tags[i]);
        }
        const newPostResult = await newPost(newPostData);
        if (!newPostResult.success) {
          toast.error(`Error uploading ${image.name}: ${newPostResult.error}`);
          setFailedUploads((prev) => [...prev, image]);
        } else {
          setUploadedFiles((prev) => [...prev, image]);
        }
      }
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Batch Upload</CardTitle>
        <CardDescription>
          Apply the same tags and description to multiple images
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tags"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <AsyncCreatableSelect<TagOption, true>
                      isDisabled={
                        isPending ||
                        uploadedFiles.length > 0 ||
                        failedUploads.length > 0
                      }
                      isMulti
                      isClearable
                      placeholder="Add tags"
                      loadOptions={debouncedFetchOptions}
                      onChange={(options) => {
                        if (options === null) {
                          onChange(null);
                        } else {
                          onChange(options.map((tag) => tag.value));
                        }
                      }}
                      unstyled
                      classNames={{
                        control: ({ isFocused }) =>
                          cn(
                            "border rounded-sm px-1",
                            isFocused && "ring-ring ring-2",
                          ),
                        container: () => "bg-background",
                        placeholder: () =>
                          "text-muted-foreground text-sm italic",
                        dropdownIndicator: ({ isFocused }) =>
                          cn(
                            "pl-1 text-muted-foreground hover:text-foreground border-l",
                            isFocused && "text-foreground",
                          ),
                        option: ({ isFocused }) =>
                          cn(
                            "bg-background p-1 rounded-sm",
                            isFocused && "bg-accent",
                          ),
                        noOptionsMessage: () => "p-1",
                        multiValue: () =>
                          "rounded-sm bg-accent overflow-hidden m-0.5",
                        multiValueLabel: () => "px-1",
                        multiValueRemove: () =>
                          "hover:bg-destructive/80 px-0.5",
                        clearIndicator: () =>
                          "text-muted-foreground hover:text-foreground px-1",
                        menuList: () =>
                          "bg-background border p-1 mt-2 rounded-sm shadow-lg",
                      }}
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
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setRenderBatchUpload(false)}
              >
                Upload Individually
              </Button>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  uploadedFiles.length > 0 ||
                  failedUploads.length > 0
                }
              >
                Upload All
              </Button>
            </div>
            <Separator />
          </form>
        </Form>
        {files.map((file) => (
          <div
            key={file.name}
            className="mt-4 flex items-center justify-between rounded-lg border p-2"
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
      </CardContent>
    </Card>
  );
}
