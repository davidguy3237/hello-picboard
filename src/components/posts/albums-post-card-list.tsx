"use client";
import { removeManyPostsFromAlbum } from "@/actions/albums";
import { PostCard } from "@/components/posts/post-card";
import { PostCardListSkeleton } from "@/components/skeletons/skeleton-post-card-list";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useCurrentUser from "@/hooks/use-current-user";
import usePostsSearchMultiCursor from "@/hooks/use-posts-search-multi-cursor";
import { cn } from "@/lib/utils";
import { Grid2X2, Grid3X3, Loader2, Loader2Icon, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export function AlbumsPostCardList({
  endpoint,
  albumId,
  albumPublicId,
}: {
  endpoint: string;
  albumId: string;
  albumPublicId: string;
}) {
  const [expandView, setExpandView] = useState<boolean>(false);
  const [cursor, setCursor] = useState<{
    id: string;
    date: Date | string;
  }>({ id: "", date: "" });
  const [toggleSelectDelete, setToggleSelectDelete] = useState<boolean>(false);
  const [postsToDelete, setPostsToDelete] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const user = useCurrentUser();

  const { isLoading, error, posts, hasMore } = usePostsSearchMultiCursor({
    query: `albumId=${albumId}`,
    cursor,
    endpoint,
  });

  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useCallback(
    (post: HTMLDivElement) => {
      if (isLoading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCursor({
            id: posts[posts.length - 1].id,
            date: posts[posts.length - 1].album!.postAddedToAlbumDate,
          });
        }
      });

      if (post) {
        observer.current.observe(post);
      }
    },
    [isLoading, hasMore, posts],
  );

  const handleRemoveSelectedPostsFromAlbum = () => {
    startTransition(async () => {
      const removeManyPostsFromAlbumResults = await removeManyPostsFromAlbum(
        albumId,
        albumPublicId,
        postsToDelete,
      );
      if (!removeManyPostsFromAlbumResults.success) {
        toast.error(removeManyPostsFromAlbumResults.error);
      } else if (removeManyPostsFromAlbumResults.success) {
        toast.success(removeManyPostsFromAlbumResults.success);
        setToggleSelectDelete(false);
        setPostsToDelete([]);
        // TODO: This is not ideal, but I can't get the data to revalidate properly
        location.reload();
      }
    });
  };

  const handleCancelRemove = () => {
    setPostsToDelete([]);
    setToggleSelectDelete(false);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-screen-2xl flex-col items-center justify-center pb-4",
        expandView && "max-w-full lg:px-1",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-end bg-background",
          user &&
            pathname.includes(`/user/${user.name}/albums/${albumPublicId}`) &&
            "sticky top-0 z-10 justify-between ",
        )}
      >
        {user &&
        pathname.includes(`/user/${user.name}/albums`) &&
        !toggleSelectDelete ? (
          <Tooltip>
            <TooltipTrigger className="m-1" asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setToggleSelectDelete(true)}
              >
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove Posts From Album</TooltipContent>
          </Tooltip>
        ) : user &&
          pathname.includes(`/user/${user.name}/albums/${albumPublicId}`) &&
          toggleSelectDelete ? (
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {postsToDelete.length} Selected
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    You are about to remove {postsToDelete.length} posts from
                    this album.
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    disabled={isPending}
                    variant="destructive"
                    onClick={handleRemoveSelectedPostsFromAlbum}
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Remove"
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" onClick={handleCancelRemove}>
              Cancel
            </Button>
          </div>
        ) : null}
        <Tooltip>
          <TooltipTrigger className="m-1 self-end" asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setExpandView(!expandView)}
              disabled={posts.length === 0 || isLoading}
              aria-label={expandView ? "Normal View" : "Expand View"}
              className="hidden md:inline-flex"
            >
              {expandView ? <Grid2X2 /> : <Grid3X3 />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {expandView ? "Normal View" : "Expand View"}
          </TooltipContent>
        </Tooltip>
      </div>
      {posts.length ? (
        <div
          className={cn(
            "grid w-full grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]",
            expandView && "sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]",
          )}
        >
          {posts.map((post, i) => {
            return (
              <PostCard
                ref={i === posts.length - 1 ? lastPostRef : null}
                key={post.sourceUrl}
                id={post.id}
                userId={post.userId || ""}
                publicId={post.publicId}
                sourceUrl={post.sourceUrl}
                thumbnailUrl={post.thumbnailUrl}
                expandView={expandView}
                toggleSelectDelete={toggleSelectDelete}
                postsToDelete={postsToDelete}
                setPostsToDelete={setPostsToDelete}
              />
            );
          })}
        </div>
      ) : posts.length === 0 && !hasMore ? (
        <p className="flex w-full items-center justify-center font-medium italic text-muted-foreground">
          No posts found...
        </p>
      ) : (
        <PostCardListSkeleton />
      )}
      {isLoading && (
        <div className="flex w-full justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </div>
  );
}
