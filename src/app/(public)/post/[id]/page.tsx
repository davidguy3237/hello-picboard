/* eslint-disable @next/next/no-img-element */
import Tag from "@/components/tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import { redirect } from "next/navigation";

interface PostPageProps {
  params: {
    id: string;
  };
}
export default async function PostPage({ params }: PostPageProps) {
  const postId = params.id;
  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      tags: true,
    },
  });

  if (!post) {
    redirect("/");
  }

  const distance = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  const formattedDate =
    distance.includes("months") || distance.includes("years")
      ? format(new Date(post.createdAt), "h:mm a · MMMM d, yyyy")
      : distance;

  return (
    <div
      className={
        "lg:max-w-screen flex flex-col divide-y px-2 pt-0 lg:h-[calc(100vh-58px)] lg:flex-row lg:divide-y-0"
      }
    >
      <div className="flex justify-center pb-2 lg:h-full lg:w-full lg:pr-2 lg:pt-2">
        <img
          alt=""
          src={post.sourceUrl}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-shrink-0 flex-col gap-y-2 pt-2 lg:w-80 lg:border-l lg:pl-2">
        <div className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage src={post.user?.image || ""} />
            <AvatarFallback className="bg-foreground">
              <User className="text-background" />
            </AvatarFallback>
          </Avatar>
          <span className={cn(!post.user && "italic text-muted-foreground")}>
            {post.user?.name || "deleted"}
          </span>
        </div>
        <div>{formattedDate}</div>
        <p
          className={cn(
            "whitespace-pre-wrap",
            !post.description && "italic text-muted-foreground",
          )}
        >
          {post.description || "No description"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((tag) => (
              <Tag key={tag.id} name={tag.name} />
            ))}
        </div>
      </div>
    </div>
  );
}
