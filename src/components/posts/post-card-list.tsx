"use client";
import { PostCard } from "@/components/posts/post-card";
import { PostCardListSkeleton } from "@/components/skeletons/skeleton-post-card-list";
import { Button } from "@/components/ui/button";
import usePostsSearch from "@/hooks/use-posts-search";
import { cn } from "@/lib/utils";
import { Grid2X2, Grid3X3, Loader2Icon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PostCardList({
  queryString,
  endpoint,
}: {
  queryString: string;
  endpoint?: string;
}) {
  const [expandView, setExpandView] = useState(false);
  const [cursor, setCursor] = useState("");

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

  return (
    <div
      className={cn(
        "flex w-full max-w-screen-2xl flex-col items-center justify-center pb-4",
        expandView && " max-w-full px-4",
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="m-1 self-end" asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setExpandView(!expandView)}
              disabled={posts.length === 0 || isLoading}
              aria-label={expandView ? "Normal View" : "Expand View"}
            >
              {expandView ? <Grid2X2 /> : <Grid3X3 />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {expandView ? "Normal View" : "Expand View"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {posts.length ? (
        <div
          className={cn(
            "grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-1",
            expandView && "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
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
