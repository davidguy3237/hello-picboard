"use client";
import { PostCard } from "@/components/posts/post-card";
import { PostCardListSkeleton } from "@/components/skeletons/skeleton-post-card-list";
import useCurrentUser from "@/hooks/use-current-user";
import usePostsSearchMultiCursor from "@/hooks/use-posts-search-multi-cursor";
import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function AlbumsPostCardList({
  endpoint,
  queryString,
}: {
  endpoint: string;
  queryString: string;
}) {
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

  return posts.length ? (
    <div className=" flex w-full max-w-screen-2xl flex-col items-center justify-start pb-4 md:m-4">
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-1">
        {posts.map((post, i) => {
          if (i === posts.length - 1) {
            return (
              <PostCard
                ref={lastPostRef}
                key={post.sourceUrl}
                id={post.id}
                userId={post.userId || ""}
                publicId={post.publicId}
                sourceUrl={post.sourceUrl}
                thumbnailUrl={post.thumbnailUrl}
                isFavorited={post.favorites[0]?.userId === user?.id}
              />
            );
          }
          return (
            <PostCard
              key={post.sourceUrl}
              id={post.id}
              userId={post.userId || ""}
              publicId={post.publicId}
              sourceUrl={post.sourceUrl}
              thumbnailUrl={post.thumbnailUrl}
              isFavorited={post.favorites[0]?.userId === user?.id}
            />
          );
        })}
      </div>
      {isLoading && (
        <div>
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </div>
  ) : posts.length === 0 && !hasMore ? (
    <div className="flex h-full w-full items-center justify-center">
      No posts found...
    </div>
  ) : (
    <PostCardListSkeleton classNames="justify-start" />
  );
}
