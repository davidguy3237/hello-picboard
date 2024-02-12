"use client";
/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileWithPath } from "react-dropzone";
import AsyncCreatableSelect from "react-select/async-creatable";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { searchTags } from "@/actions/search-tags";
import { useDebounce } from "@/hooks/use-debounce";
import { newPost } from "@/actions/new-post";
import { uploadImageB2 } from "@/actions/upload-image-b2-";
import { writeReadableFileSize } from "@/lib/utils";

interface UploadFormProps {
  file: FileWithPath;
}
interface TagOption {
  value: string;
  label: string;
}

export function UploadForm({ file }: UploadFormProps) {
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

  const debouncedFetchOptions = useDebounce(fetchOptionsCallback, 500);

  const onSubmit = async (uploadData: z.infer<typeof UploadSchema>) => {
    console.log("FORM SUBMITTED");
    console.log(uploadData);

    const formdata = new FormData();
    formdata.append("file", file);
    const uploadImageResult = await uploadImageB2(formdata);

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
        console.error(newPostResult.error);
      }

      if (newPostResult.success) {
        console.log(newPostResult.success);
      }
      // TODO: create loading state when new post is made
    }
  };

  return (
    <Card className="flex h-full w-full items-center">
      <CardContent className="flex h-full w-full pt-6">
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
              control={form.control}
              name="tags"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <AsyncCreatableSelect<TagOption, true>
                      isMulti
                      isClearable
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
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} maxLength={500} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
