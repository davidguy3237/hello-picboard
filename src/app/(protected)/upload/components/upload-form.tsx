/* eslint-disable @next/next/no-img-element */
"use client";
import { newPost } from "@/actions/posts";
import { searchTags } from "@/actions/search-tags";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useDebounceFunction } from "@/hooks/use-debounce";
import { cn, writeReadableFileSize } from "@/lib/utils";
import { UploadSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent } from "@radix-ui/react-dialog";
import { CheckCircle, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { FileWithPath } from "react-dropzone";
import { useForm } from "react-hook-form";
import AsyncCreatableSelect from "react-select/async-creatable";
import { toast } from "sonner";
import * as z from "zod";

interface UploadFormProps {
  file: FileWithPath;
  removeFile: (file: FileWithPath) => void;
  uploadedFiles: FileWithPath[];
  setUploadedFiles: (file: FileWithPath[]) => void;
}
interface TagOption {
  value: string;
  label: string;
}

export function UploadForm({
  file,
  removeFile,
  uploadedFiles,
  setUploadedFiles,
}: UploadFormProps) {
  const [isPending, startTransition] = useTransition();
  const [postUrl, setPostUrl] = useState<string>("");
  const [uploadFailed, setUploadFailed] = useState<boolean>(false);
  const blobURL = URL.createObjectURL(file);

  const form = useForm<z.infer<typeof UploadSchema>>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      tags: [],
      description: "",
      image: file,
    },
  });

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

  const onSubmit = async (uploadData: z.infer<typeof UploadSchema>) => {
    startTransition(async () => {
      const newPostData = new FormData();
      newPostData.append("image", file);
      newPostData.append("description", uploadData.description as string);
      for (let i = 0; i < uploadData.tags.length; i++) {
        newPostData.append("tags[]", uploadData.tags[i]);
      }
      const newPostResult = await newPost(newPostData);
      if (newPostResult.error) {
        setUploadFailed(true);
        console.error(newPostResult);
        toast.error("Error: " + newPostResult.error);
      } else if (newPostResult.success) {
        setUploadedFiles([...uploadedFiles, file]);
        setPostUrl(newPostResult.success.postUrl);
      }
    });
  };

  return (
    <Card className="flex h-full w-full items-center">
      <CardContent className="relative flex h-full w-full p-2">
        {(isPending || !!postUrl) && (
          <div
            className={cn(
              "absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-lg bg-muted/50 backdrop-blur-sm",
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
                <Link
                  target="_blank"
                  href={postUrl}
                  className="hover:underline"
                >
                  Click here to visit your new post
                </Link>
              </div>
            ) : null}
          </div>
        )}
        <Form {...form}>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className=" flex h-full basis-1/4 flex-col items-center justify-center pr-2">
                <Dialog>
                  <DialogTrigger>
                    <img
                      alt=""
                      src={blobURL}
                      className="max-h-full max-w-full object-contain"
                    />
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                      <img
                        alt=""
                        src={blobURL}
                        className="fixed left-[50%] top-[50%] z-50 h-fit max-h-screen w-auto max-w-full translate-x-[-50%] translate-y-[-50%] object-contain"
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
                <FormMessage />
              </FormItem>
            )}
          />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full basis-3/4 flex-col gap-y-1 border-l pl-2"
          >
            <div>
              {file.path} - {writeReadableFileSize(file.size)}
            </div>
            <FormField
              disabled={isPending || !!postUrl || uploadFailed}
              control={form.control}
              name="tags"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <AsyncCreatableSelect<TagOption, true>
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
              disabled={isPending || !!postUrl || uploadFailed}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      maxLength={500}
                      disabled={isPending || !!postUrl || uploadFailed}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending || !!postUrl || uploadFailed}
            >
              Submit
            </Button>
          </form>
        </Form>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 rounded-full"
          onClick={() => removeFile(file)}
        >
          <X />
        </Button>
      </CardContent>
    </Card>
  );
}
