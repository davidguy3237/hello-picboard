import { Post } from "@prisma/client";
import { useEffect, useState } from "react";

interface usePostSearchProps {
  query: string;
  cursor: string;
  endpoint?: string;
}

export default function usePostsSearch({
  query,
  cursor = "",
  endpoint = "/api/posts/infinite",
}: usePostSearchProps) {
  const [posts, setPosts] = useState<Post[]>([]);
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
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
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
