/* eslint-disable @next/next/no-img-element */
import { FavoriteButton } from "@/components/posts/favorite-button";
import { OptionsPopover } from "@/components/posts/options-popover";
import Tag from "@/components/posts/tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Clock, Ruler, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: {
    id: string;
  };
}
export default async function PostPage({ params }: PostPageProps) {
  const user = await currentUser();
  const post = await db.post.findUnique({
    where: {
      publicId: params.id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      tags: true,
      _count: {
        select: {
          reports: true,
        },
      },
    },
  });

  if (!post || post._count.reports >= 3) {
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

  const avatarImageUrl = post.user?.image?.includes("avatars/")
    ? `${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${post.user.image}`
    : post.user?.image;

  return (
    <div
      className={
        "flex h-[calc(100dvh-57px)] w-full flex-col divide-y lg:flex-row lg:divide-y-0"
      }
    >
      <div className="relative flex h-full max-h-[calc(100dvh-57px-180px)] w-full justify-center lg:max-h-full">
        <img
          alt=""
          src={`${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${post.sourceUrl}`}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="relative flex w-full flex-shrink-0 flex-col gap-y-2 p-2 lg:w-80 lg:border-l lg:pb-0 lg:pl-2 lg:pr-0 lg:pt-2">
        {user && (
          <FavoriteButton
            postId={post.id}
            classNames="text-foreground right-8 left-auto"
          />
        )}
        <OptionsPopover
          postId={post.id}
          userId={post.userId || ""}
          publicId={post.publicId}
          sourceUrl={post.sourceUrl}
        />
        {post.user ? (
          <Link
            href={`/user/${post.user.name}/posts`}
            className="flex w-fit items-center gap-x-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarImageUrl || ""} />
              <AvatarFallback className="bg-foreground">
                <User className="text-background" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium underline-offset-4 hover:underline">
              {post.user?.name}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-foreground">
                <User className="text-background" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm italic text-muted-foreground">
              deleted
            </span>
          </div>
        )}
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Ruler className="h-4 w-4" />
          {post.width && post.height ? (
            <span>{`${post.width} x ${post.height}`}</span>
          ) : (
            <span className="italic text-muted-foreground">
              Dimensions not available
            </span>
          )}
        </div>
        <p
          className={cn(
            "whitespace-pre-wrap text-wrap break-words",
            !post.description && "italic text-muted-foreground",
          )}
        >
          {post.description || "No description"}
        </p>
        <div className="mt-4 flex flex-wrap gap-1">
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
