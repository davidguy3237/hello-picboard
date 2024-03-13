/* eslint-disable @next/next/no-img-element */
"use client";

import { deletePost, editPost } from "@/actions/posts";
import { searchTags } from "@/actions/search-tags";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { EditPostSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post } from "@prisma/client";
import { DialogContent } from "@radix-ui/react-dialog";
import { CheckCircle, Loader2, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import AsyncCreatableSelect from "react-select/async-creatable";
import { toast } from "sonner";
import * as z from "zod";

type SelectTag = {
  value: string;
  label: string;
};

type PostWithTags = Post & {
  tags: {
    id: string;
    name: string;
  }[];
};

export function EditPostForm({ post }: { post: PostWithTags }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [postUrl, setPostUrl] = useState<string>("");
  const originalTags = post.tags.map((tag) => tag.name);
  const defaultSelectTags: SelectTag[] = post.tags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  const form = useForm<z.infer<typeof EditPostSchema>>({
    resolver: zodResolver(EditPostSchema),
    defaultValues: {
      publicId: post.publicId,
      originalTags: originalTags,
      updatedTags: originalTags,
      description: post.description || undefined,
    },
  });

  const fetchOptionsCallback = (
    inputValue: string,
    callback: (options: SelectTag[]) => void,
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

  const onSubmit = async (editData: z.infer<typeof EditPostSchema>) => {
    startTransition(async () => {
      const editPostResult = await editPost(editData);
      if (!editPostResult.success) {
        toast.error(editPostResult.error);
      } else if (editPostResult.success) {
        // TODO: Issues with the parallel/intercepting route causes 404 if using router.push()
        // Either fix later or leave users a link to click
        setPostUrl(`/post/${post.publicId}`);
        setIsComplete(true);
      }
    });
  };

  const handleDeletePost = () => {
    startTransition(async () => {
      const deletePostResult = await deletePost(post.publicId);
      if (!deletePostResult.success) {
        toast.error(deletePostResult.error);
      } else if (deletePostResult.success) {
        router.push("/");
        toast.success(deletePostResult.success);
      }
    });
  };

  // TODO: fix overflow issue with the image maybe

  return (
    <Card className="relative mt-4 w-full max-w-screen-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Edit Post</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full">
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
                <a href={postUrl} className="hover:underline">
                  Click here to visit your updated post
                </a>
              </div>
            ) : null}
          </div>
        )}
        <Dialog>
          <DialogTrigger className=" flex w-1/4 items-center justify-center pr-2">
            <img
              alt=""
              src={post.thumbnailUrl}
              className="max-h-full max-w-full object-contain"
            />
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <img
                alt=""
                src={post.sourceUrl}
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full basis-3/4 flex-col gap-y-1 border-l pl-2"
          >
            <FormField
              control={form.control}
              name="updatedTags"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <AsyncCreatableSelect<SelectTag, true>
                      isDisabled={isPending || isComplete}
                      isMulti
                      isClearable
                      placeholder="Add tags"
                      instanceId="edit-post-tags"
                      defaultValue={defaultSelectTags}
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      maxLength={500}
                      className="h-48"
                      disabled={isPending || isComplete}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending || isComplete}>
              Submit
            </Button>
          </form>
        </Form>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isPending || isComplete}
              variant="destructive"
              className="absolute right-2 top-2 flex w-36 items-center justify-between"
            >
              <Trash2 size={22} />
              <span>Delete Post</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                You are about to delete this post!
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={handleDeletePost}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
