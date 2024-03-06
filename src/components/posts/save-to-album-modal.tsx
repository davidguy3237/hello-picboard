"use client";
import { createNewAlbum } from "@/actions/create-new-album";
import { addPostToAlbum, removePostToAlbum } from "@/actions/post-to-album";
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
import { Album, Post } from "@prisma/client";
import { AlbumIcon, Loader2, Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface SaveToAlbumModalProps {
  postId: string;
}

type AlbumWithPost = Album & {
  posts: Post[];
};

export function SaveToAlbumModal({ postId }: SaveToAlbumModalProps) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [albums, setAlbums] = useState<AlbumWithPost[]>([]);
  const user = useCurrentUser();

  useEffect(() => {
    if (showModal) {
      fetch(`/api/albums/personal?user=${user?.id}&post=${postId}`)
        .then((res) => res.json())
        .then((data) => {
          setAlbums(data.albums);
        });
    }
  }, [showModal, user?.id, postId]);

  const form = useForm<z.infer<typeof NewAlbumSchema>>({
    defaultValues: {
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
        toast.success("Created new album");
      }
    });
  };

  const handleChecked = (
    albumId: string,
    checked: boolean | "indeterminate",
  ) => {
    if (checked === "indeterminate") {
      return;
    } else if (checked) {
      addPostToAlbum(albumId, postId);
    } else {
      removePostToAlbum(albumId, postId);
    }
  };

  if (!user) {
    return null;
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
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>Save To Album</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {albums.map((album) => (
            <div key={album.id} className="flex items-center space-x-2">
              <Checkbox
                id={album.id}
                defaultChecked={album.posts.some(
                  (post) => post.publicId === postId,
                )}
                onCheckedChange={(checked) => handleChecked(album.id, checked)}
              />
              <Label htmlFor={album.id} className="text-sm font-medium">
                {album.name}
              </Label>
            </div>
          ))}
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
