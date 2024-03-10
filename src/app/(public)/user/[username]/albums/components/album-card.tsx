/* eslint-disable @next/next/no-img-element */
"use client";
import { deleteAlbum } from "@/actions/albums";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import useCurrentUser from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { Album } from "@prisma/client";
import { PopoverContent } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Copy, ImageIcon, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface AlbumCardProps {
  album: Album & {
    posts: {
      postId: string;
      albumId: string;
      createdAt: Date;
      post: { thumbnailUrl: string };
    }[];
    _count: { posts: number };
  };
  username: string;
  userId: string;
}

export function AlbumCard({ album, username, userId }: AlbumCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);
  const user = useCurrentUser();
  const writeURLToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_APP_URL}/user/${username}/albums/${album.publicId}`,
      );
      toast.success("Copied URL to clipboard!");
      return;
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) message = error.message;
      toast.error(message);
      return;
    }
  };

  const handleDeleteAlbum = () => {
    startTransition(async () => {
      const deleteAlbumResults = await deleteAlbum(album);

      if (!deleteAlbumResults.success) {
        setShowAlertDialog(false);
        toast.error(deleteAlbumResults.error);
        return;
      } else if (deleteAlbumResults.success) {
        setShowAlertDialog(false);
        toast.success(deleteAlbumResults.success);
      }
    });
  };

  return (
    <Card className="h-60 w-60 overflow-hidden">
      <CardContent className="group relative h-full w-full p-0">
        <Link href={`/user/${username}/albums/${album.publicId}`}>
          {album.posts.length > 0 ? (
            <img
              alt=""
              src={album.posts[0].post.thumbnailUrl}
              className="h-2/3 w-full rounded-b-none object-cover"
            />
          ) : (
            <div className="flex h-2/3 w-full items-center justify-center rounded-b-none bg-secondary object-cover">
              <ImageIcon className=" h-20 w-20 text-muted-foreground" />
            </div>
          )}
          <div className="relative h-1/3 w-full space-y-1 p-1 text-sm">
            <div className="w-full font-medium">{album.name}</div>
            <div>{format(album.createdAt, "MMMM d, yyyy")}</div>
            <div>{album._count.posts} Posts</div>
          </div>
        </Link>
        <Popover>
          <PopoverTrigger
            className={cn(
              "invisible absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-accent hover:text-accent-foreground group-hover:visible",
              album.posts.length === 0 && "text-muted-foreground",
            )}
          >
            <MoreHorizontal />
          </PopoverTrigger>
          <PopoverContent className="z-50 w-fit border bg-popover p-0 text-popover-foreground sm:rounded-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={writeURLToClipboard}
              className="flex w-full justify-between active:bg-background"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
            {user?.id === userId && (
              <AlertDialog
                open={showAlertDialog}
                onOpenChange={setShowAlertDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex w-full justify-between hover:bg-destructive hover:text-destructive-foreground active:bg-background"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      You are about to delete this album!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the album, but all of the
                      posts that were added to the album will be unaffected.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      disabled={isPending}
                      variant="destructive"
                      onClick={handleDeleteAlbum}
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
}
