"use client";
/* eslint-disable @next/next/no-img-element */
import { newPost } from "@/actions/new-post";
import { searchTags } from "@/actions/search-tags";
import { uploadImage } from "@/actions/upload-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { CheckCircle, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { FileWithPath } from "react-dropzone";
import { useForm } from "react-hook-form";
import AsyncCreatableSelect from "react-select/async-creatable";
import * as z from "zod";

interface UploadFormProps {
  file: FileWithPath;
}
interface TagOption {
  value: string;
  label: string;
}

export function UploadForm({ file }: UploadFormProps) {
  const [isPending, startTransition] = useTransition();
  const [uploadCompleted, setUploadCompleted] = useState(false);
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
    if (inputValue.length >= 3) {
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

  const debouncedFetchOptions = useDebounceFunction(fetchOptionsCallback, 500);

  const onSubmit = async (uploadData: z.infer<typeof UploadSchema>) => {
    startTransition(async () => {
      const formdata = new FormData();
      formdata.append("file", file);
      const uploadImageResult = await uploadImage(formdata);

      if (uploadImageResult.error) {
        console.error(uploadImageResult.error);
      }
      if (uploadImageResult.success) {
        const { sourceUrl, thumbnailUrl } = uploadImageResult.success;

        const newPostData = {
          tags: uploadData.tags,
          description: uploadData.description,
          sourceUrl,
          thumbnailUrl,
        };

        const newPostResult = await newPost(newPostData);

        if (newPostResult.error) {
          console.error("Creating new post failed: ", newPostResult.error);
        }

        if (newPostResult.success) {
          console.log("Successfully created new post: ", newPostResult.success);
        }

        setUploadCompleted(true);
      }
    });
  };

  // TODO: Add Option to delete upload form

  return (
    <Card className="flex h-full w-full items-center">
      <CardContent className="relative flex h-full w-full pt-6">
        {(isPending || uploadCompleted) && (
          <div
            className={cn(
              "absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-lg bg-muted/50",
            )}
          >
            {isPending ? (
              <Loader2 size={48} className="animate-spin" />
            ) : (
              <CheckCircle
                size={48}
                className=" text-green-500 duration-500 animate-in fade-in zoom-in"
              />
            )}
          </div>
        )}
        <Form {...form}>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className=" flex h-full basis-1/4 flex-col items-center justify-center pr-4">
                <img
                  alt=""
                  src={blobURL}
                  className="h-full max-w-full object-contain"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full basis-3/4 flex-col gap-y-2 border-l pl-4"
          >
            <div>
              {file.path} - {writeReadableFileSize(file.size)}
            </div>
            <FormField
              disabled={isPending || uploadCompleted}
              control={form.control}
              name="tags"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <AsyncCreatableSelect<TagOption, true>
                      isDisabled={isPending || uploadCompleted}
                      isMulti
                      isClearable
                      placeholder="Add tags"
                      loadOptions={debouncedFetchOptions}
                      onChange={(option) => {
                        if (option === null) {
                          onChange(null);
                          return;
                        }
                        onChange(option.map((el) => el.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isPending || uploadCompleted}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      maxLength={500}
                      disabled={isPending || uploadCompleted}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending || uploadCompleted}>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
