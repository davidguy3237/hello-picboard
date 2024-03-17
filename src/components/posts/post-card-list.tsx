"use client";
import { PostCard } from "@/components/posts/post-card";
import { PostCardListSkeleton } from "@/components/skeletons/skeleton-post-card-list";
import { Button, buttonVariants } from "@/components/ui/button";
import usePostsSearch from "@/hooks/use-posts-search";
import { cn } from "@/lib/utils";
import { Grid2X2, Grid3X3, Loader2, Loader2Icon, Trash2 } from "lucide-react";
import { useCallback, useRef, useState, useTransition } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import useCurrentUser from "@/hooks/use-current-user";
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
} from "../ui/alert-dialog";
import { deleteManyPosts } from "@/actions/posts";
import { toast } from "sonner";

export function PostCardList({
  queryString,
  endpoint,
}: {
  queryString: string;
  endpoint?: string;
}) {
  const [expandView, setExpandView] = useState(false);
  const [cursor, setCursor] = useState("");
  const [toggleSelectDelete, setToggleSelectDelete] = useState<boolean>(false);
  const [postsToDelete, setPostsToDelete] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const user = useCurrentUser();

  const { isLoading, error, posts, hasMore } = usePostsSearch({
    query: queryString,
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
          setCursor(posts[posts.length - 1].id);
        }
      });

      if (post) {
        observer.current.observe(post);
      }
    },
    [isLoading, hasMore, posts],
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleDeleteSelectedPosts = () => {
    startTransition(async () => {
      const deleteManyPostsResults = await deleteManyPosts(postsToDelete);
      if (!deleteManyPostsResults.success) {
        toast.error(deleteManyPostsResults.error);
      } else if (deleteManyPostsResults.success) {
        toast.success(deleteManyPostsResults.success);
        setPostsToDelete([]);
        setToggleSelectDelete(false);
      }
    });
  };
  const handleCancelDelete = () => {
    setPostsToDelete([]);
    setToggleSelectDelete(false);
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-screen-2xl flex-col items-center justify-center pb-4",
        expandView && " max-w-full lg:px-4",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-end",
          user &&
            pathname.includes(`/user/${user.name}/posts`) &&
            "justify-between",
        )}
      >
        {user &&
        pathname.includes(`/user/${user.name}/posts`) &&
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
            <TooltipContent>Delete Posts</TooltipContent>
          </Tooltip>
        ) : user &&
          pathname.includes(`/user/${user.name}/posts`) &&
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
                    You are about to delete {postsToDelete.length} posts.
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
                    onClick={handleDeleteSelectedPosts}
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
          </div>
        ) : null}
        <Tooltip>
          <TooltipTrigger className="m-1" asChild>
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
