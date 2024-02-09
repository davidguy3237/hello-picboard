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

interface UploadFormProps {
  file: FileWithPath;
}

export interface TagOption {
  value: string;
  label: string;
}

export function UploadForm({ file }: UploadFormProps) {
  const form = useForm<z.infer<typeof UploadSchema>>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      tags: [],
      description: "",
      image: file,
    },
  });

  const calculateFileSize = (fileSize: number) => {
    if (fileSize / 1024 < 1) {
      return `${fileSize} Bytes`;
    } else if (fileSize / 1024 / 1024 < 1) {
      return `${(fileSize / 1024).toFixed(2)} KB`;
    } else {
      return `${(fileSize / 1024 / 1024).toFixed(2)} MB`;
    }
  };

  const onSubmit = (uploadData: z.infer<typeof UploadSchema>) => {
    console.log("FORM SUBMITTED");
    console.log(uploadData);
  };

  // const fetchOptionsPromise = (inputValue: string) => {
  //   if (inputValue.length >= 3) {
  //     return searchTags(inputValue).then((results) => {
  //       if (results.error) {
  //         console.error(results.error);
  //         return new Promise<TagOption[]>((resolve) => resolve([]));
  //       }
  //       console.log("GOT RESULTS");
  //       return results.success as TagOption[];
  //     });
  //   } else {
  //     console.log("NOT LONG ENOUGH");
  //     return new Promise<TagOption[]>((resolve) => resolve([]));
  //   }
  // };

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
                  src={URL.createObjectURL(file)}
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
              {file.path} - {calculateFileSize(file.size)}
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
