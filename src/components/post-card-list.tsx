"use client";
import { PostCard } from "@/components/post-card";

interface PostCardListProps {
  posts: {
    id: string;
    sourceUrl: string;
    thumbnailUrl: string;
  }[];
}

export function PostCardList({ posts }: PostCardListProps) {
  return (
    <div className="flex max-w-screen-2xl flex-row flex-wrap justify-center">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.sourceUrl}
            id={post.id}
            sourceUrl={post.sourceUrl}
            thumbnailUrl={post.thumbnailUrl}
          />
        ))
      ) : (
        <div>No posts found</div>
      )}
    </div>
  );
}
