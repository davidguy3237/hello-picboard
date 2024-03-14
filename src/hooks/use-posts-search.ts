import { Post } from "@prisma/client";
import { useEffect, useState } from "react";

interface usePostSearchProps {
  query: string;
  cursor: string;
  endpoint?: string;
}

type PostWithReportCount = Post & {
  _count: {
    reports: number;
  };
};

export default function usePostsSearch({
  query,
  cursor = "",
  endpoint = "/api/posts/infinite",
}: usePostSearchProps) {
  const [posts, setPosts] = useState<PostWithReportCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const getMorePosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${endpoint}?cursor=${cursor}&${query}`, {
          signal,
        });
        const data = await response.json();
        const filteredPosts = data.posts.filter(
          (post: PostWithReportCount) => post._count.reports < 3,
        );
        setPosts((prevPosts) => [...prevPosts, ...filteredPosts]);
        setHasMore(data.posts.length === 25);
      } catch (error) {
        if (signal.aborted) {
          return;
        } else if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("Unknown error getting more posts"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    getMorePosts();
    return () => controller.abort();
  }, [query, cursor, endpoint]);

  return {
    isLoading,
    error,
    posts,
    hasMore,
  };
}
