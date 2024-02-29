import { PostCardList } from "@/components/posts/post-card-list";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PostTabsProps {
  params: {
    username: string;
  };
}

export default function PostsTab({ params }: PostTabsProps) {
  console.log("RENDERING POSTS TAB");
  console.log(params.username);
  const queryString = `username=${params.username}`;

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto ">
      <PostCardList key={Math.random()} queryString={queryString} />
    </div>
  );
}
