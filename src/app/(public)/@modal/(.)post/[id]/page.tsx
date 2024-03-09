/* eslint-disable @next/next/no-img-element */
import { FavoriteButton } from "@/components/posts/favorite-button";
import ImageDisplay from "@/components/posts/image-display";
import { OptionsPopover } from "@/components/posts/options-popover";
import { PostInterceptModal } from "@/components/posts/post-intercept-modal";
import Tag from "@/components/posts/tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Clock, Ruler, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
interface InterceptedPostPageProps {
  params: {
    id: string;
  };
}

export default async function InterceptedPostPage({
  params,
}: InterceptedPostPageProps) {
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
      favorites: user
        ? {
            where: {
              userId: user.id,
            },
          }
        : undefined,
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
    <PostInterceptModal>
      <div className="fixed left-[50%] top-[50%] z-50 flex h-max max-h-screen w-max max-w-full translate-x-[-50%] translate-y-[-50%] flex-col divide-y lg:flex-row lg:divide-y-0">
        <ImageDisplay
          url={post.sourceUrl}
          width={post.width}
          height={post.height}
        />
        <div className="relative flex w-full flex-shrink-0 flex-col gap-y-2 bg-background p-2 lg:w-80 lg:border-l lg:pb-0 lg:pl-2 lg:pr-0 lg:pt-2">
          {user && (
            <FavoriteButton
              postId={post.id}
              isFavorited={post.favorites[0]?.userId === user?.id}
              classNames="text-foreground right-8 left-auto"
            />
          )}
          <OptionsPopover
            postId={post.id}
            userId={post.userId || ""}
            publicId={post.publicId}
          />
          {post.user ? (
            <Link
              href={`/user/${post.user.name}/posts`}
              className="flex items-center gap-x-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.user?.image || ""} />
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ruler className="h-4 w-4" />
            {post.width && post.height ? (
              <span>{`${post.width} x ${post.height}`}</span>
            ) : (
              <span className="italic text-muted-foreground">
                No dimensions provided
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
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((tag) => (
                <Tag key={tag.id} name={tag.name} />
              ))}
          </div>
        </div>
      </div>
    </PostInterceptModal>
  );
}
