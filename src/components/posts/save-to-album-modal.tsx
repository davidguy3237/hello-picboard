"use client";
import {
  addPostToAlbum,
  createNewAlbum,
  removePostFromAlbum,
} from "@/actions/albums";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Label } from "@/components/ui/label";
import useCurrentUser from "@/hooks/use-current-user";
import { NewAlbumSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Album, PostsAlbums } from "@prisma/client";
import { AlbumIcon, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface SaveToAlbumModalProps {
  postId: string;
}

type AlbumWithPost = Album & {
  posts: PostsAlbums[];
};

export function SaveToAlbumModal({ postId }: SaveToAlbumModalProps) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [albums, setAlbums] = useState<AlbumWithPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = useCurrentUser();

  useEffect(() => {
    if (showModal) {
      fetch(`/api/albums/checkboxes?user=${user?.id}&postId=${postId}`)
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          setAlbums(data.albums);
        });
    }
  }, [showModal, user?.id, postId]);

  const form = useForm<z.infer<typeof NewAlbumSchema>>({
    resolver: zodResolver(NewAlbumSchema),
    defaultValues: {
      postId: postId,
      albumName: "",
    },
  });

  const onSubmit = (newAlbumData: z.infer<typeof NewAlbumSchema>) => {
    startTransition(async () => {
      const createNewAlbumResults = await createNewAlbum(newAlbumData);
      if (!createNewAlbumResults.success) {
        toast.error("Failed to create new album");
      } else if (createNewAlbumResults.success) {
        setShowModal(false);
        setShowForm(false);
        form.reset();
        toast.success(`Saved to album: ${createNewAlbumResults.success.name}`);
      }
    });
  };

  const handleChecked = async (
    checked: boolean | "indeterminate",
    albumId: string,
    albumName: string,
  ) => {
    if (checked === "indeterminate") {
      return;
    } else if (checked) {
      const addPostToAlbumResults = await addPostToAlbum(albumId, postId);

      if (!addPostToAlbumResults.success) {
        toast.error(`Failed to add post to album: ${albumName}`);
      }
    } else {
      const removePostFromAlbumResults = await removePostFromAlbum(
        albumId,
        postId,
      );

      if (!removePostFromAlbumResults.success) {
        toast.error(`Failed to remove post from album: ${albumName}`);
      }
    }
  };

  if (!user) {
    return (
      <Link href={"/login"} prefetch={false}>
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full justify-between active:bg-background"
        >
          <AlbumIcon className="mr-2 h-4 w-4" />
          Add To Album
        </Button>
      </Link>
    );
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full justify-between active:bg-background"
        >
          <AlbumIcon className="mr-2 h-4 w-4" />
          Add To Album
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-fit max-h-[50%] flex-col">
        <DialogHeader>
          <DialogTitle>Save To Album</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] w-full space-y-2 overflow-y-auto overflow-x-hidden py-4">
          {albums.length ? (
            albums.map((album) => (
              <div
                key={album.id}
                className="flex w-full items-center space-x-2"
              >
                <Checkbox
                  id={album.id}
                  defaultChecked={album.posts.some(
                    (post) => post.postId === postId,
                  )}
                  onCheckedChange={(checked) =>
                    handleChecked(checked, album.id, album.name)
                  }
                />
                <Label htmlFor={album.id} className="text-sm font-medium ">
                  {album.name}
                </Label>
              </div>
            ))
          ) : isLoading ? (
            <div className="flex w-full items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-center" />
            </div>
          ) : (
            <div className="flex w-full items-center justify-center text-sm font-medium italic text-muted-foreground">
              <p>You have no albums...</p>
            </div>
          )}
        </div>
        {showForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="albumName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Album Name</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="flex w-full items-center"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create new album
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
