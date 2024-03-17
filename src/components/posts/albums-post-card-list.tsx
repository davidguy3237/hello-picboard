"use client";
import { PostCard } from "@/components/posts/post-card";
import { PostCardListSkeleton } from "@/components/skeletons/skeleton-post-card-list";
import useCurrentUser from "@/hooks/use-current-user";
import usePostsSearchMultiCursor from "@/hooks/use-posts-search-multi-cursor";
import { Grid2X2, Grid3X3, Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function AlbumsPostCardList({
  endpoint,
  queryString,
}: {
  endpoint: string;
  queryString: string;
}) {
  const [expandView, setExpandView] = useState<boolean>(false);
  const [cursor, setCursor] = useState<{
    id: string;
    date: Date | string;
  }>({ id: "", date: "" });

  const user = useCurrentUser();

  const { isLoading, error, posts, hasMore } = usePostsSearchMultiCursor({
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

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-screen-2xl flex-col items-center justify-center pb-4",
        expandView && " max-w-full lg:px-4",
      )}
    >
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
