import { PostCardList } from "@/components/posts/post-card-list";
import { redirect } from "next/navigation";

interface PostTabsProps {
  params: {
    username: string;
  };
}

export default async function Page({ params }: PostTabsProps) {
  redirect(`/user/${params.username}/posts`);
  // const queryString = `username=${params.username}`;

  // return (
  //   <div className="flex h-full w-full flex-col items-center overflow-y-auto ">
  //     <PostCardList key={Math.random()} queryString={queryString} />
  //   </div>
  // );
}
