/* eslint-disable @next/next/no-img-element */
import Tag from "@/components/tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Clock, Download, MoreHorizontal, Ruler, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: {
    id: string;
  };
}
export default async function PostPage({ params }: PostPageProps) {
  console.log("POST PAGE");
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
    notFound();
  }

  const distance = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  const fullDate = format(new Date(post.createdAt), "h:mm a · MMMM d, yyyy");

  const dateToShow =
    distance.includes("months") || distance.includes("years")
      ? fullDate
      : distance;

  return (
    <div
      className={
        "flex h-[calc(100vh-57px)] w-full flex-col divide-y lg:flex-row lg:divide-y-0"
      }
    >
      <div className="relative flex h-full max-h-[calc(100vh-57px-180px)] w-full justify-center lg:max-h-full">
        <img
          alt=""
          src={post.sourceUrl}
          className="h-full w-full object-contain"
        />
        <Popover>
          <PopoverTrigger className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground">
            <MoreHorizontal />
          </PopoverTrigger>
          <PopoverContent
            className="w-fit border bg-popover p-0 text-popover-foreground sm:rounded-sm"
            align="end"
          >
            <Link href={post.sourceUrl} download>
              <Button
                variant="ghost"
                size="sm"
                className="flex justify-between active:bg-background"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </Link>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex w-full flex-shrink-0 flex-col gap-y-2 p-2 lg:w-80 lg:border-l lg:pb-0 lg:pl-2 lg:pr-0 lg:pt-2">
        <div className="flex items-center gap-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user?.image || ""} />
            <AvatarFallback className="bg-foreground">
              <User className="text-background" />
            </AvatarFallback>
          </Avatar>
          <span className={cn(!post.user && "italic text-muted-foreground")}>
            {post.user?.name || "deleted"}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{dateToShow}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fullDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {post.width && post.height && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ruler className="h-4 w-4" />
            <span>{`${post.width} x ${post.height}`}</span>
          </div>
        )}
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
