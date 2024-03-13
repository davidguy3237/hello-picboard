"use client";
import { createNewAlbum } from "@/actions/albums";
import { Button } from "@/components/ui/button";
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
import { NewAlbumSchema } from "@/schemas";
import { Loader2, PlusCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { AlbumCardType } from "./album-cards-list";

export function NewAlbumButton({
  setAlbums,
}: {
  setAlbums: React.Dispatch<React.SetStateAction<AlbumCardType[]>>;
}) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState<boolean>(false);
  const form = useForm<z.infer<typeof NewAlbumSchema>>({
    defaultValues: {
      postId: undefined,
      albumName: "",
    },
  });

  const onSubmit = (newAlbumData: z.infer<typeof NewAlbumSchema>) => {
    startTransition(async () => {
      const createNewAlbumResults = await createNewAlbum(newAlbumData);
      if (!createNewAlbumResults.success) {
        toast.error("Failed to create new album");
      } else if (createNewAlbumResults.success) {
        const newAlbum: AlbumCardType = {
          ...createNewAlbumResults.success,
          posts: [],
          _count: {
            posts: 0,
          },
        };
        setAlbums((prevAlbums) => [newAlbum, ...prevAlbums]);
        setShowModal(false);
        form.reset();
        toast.success(
          `Created new album: ${createNewAlbumResults.success.name}`,
        );
      }
    });
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger className="flex h-60 w-60 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted text-muted-foreground hover:border-accent-foreground hover:bg-accent hover:text-accent-foreground">
        <PlusCircle className="h-12 w-12" />
        <p className="italic">Create an album</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an album</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
