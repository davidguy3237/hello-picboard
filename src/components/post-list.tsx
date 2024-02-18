"use client";
import { Post } from "@/components/post";

interface PostListProps {
  posts: ({
    user: { name: string } | null;
    tags: { name: string }[];
  } & {
    id: string;
    userId: string | null;
    sourceUrl: string;
    thumbnailUrl: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  })[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="flex max-w-screen-2xl flex-row flex-wrap justify-center">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.sourceUrl}
            sourceUrl={post.sourceUrl}
            thumbnailUrl={post.thumbnailUrl}
            description={post.description ?? "No description"}
            createdAt={post.createdAt}
            username={post.user?.name ?? "deleted"}
            userId={post.userId ?? "deleted"}
            tags={post.tags}
          />
        ))
      ) : (
        <div>No posts found</div>
      )}
    </div>
  );
}
