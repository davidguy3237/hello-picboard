import { useEffect, useState } from "react";

interface usePostSearchProps {
  query: string;
  cursor: string;
}

type Posts = {
  id: string;
  publicId: string;
  sourceUrl: string;
  thumbnailUrl: string;
  description: string;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}[];

export default function usePostsSearch({
  query,
  cursor = "",
}: usePostSearchProps) {
  const [posts, setPosts] = useState<Posts>([]);
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
        const response = await fetch(
          `/api/infinite-posts?cursor=${cursor}&${query}`,
          {
            signal,
          },
        );
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
  }, [query, cursor]);

  return {
    isLoading,
    error,
    posts,
    hasMore,
  };
}
