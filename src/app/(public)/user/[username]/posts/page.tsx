import { PostCardList } from "@/components/posts/post-card-list";

interface PostTabsProps {
  params: {
    username: string;
  };
}

export default function UserPostsTab({ params }: PostTabsProps) {
  const queryString = `username=${params.username}`;

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto ">
      <PostCardList key={Math.random()} queryString={queryString} />
    </div>
  );
}
