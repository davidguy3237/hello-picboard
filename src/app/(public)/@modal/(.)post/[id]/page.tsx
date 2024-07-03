/* eslint-disable @next/next/no-img-element */
import DateDisplay from "@/components/date-display";
import { FavoriteButton } from "@/components/posts/favorite-button";
import ImageDisplay from "@/components/posts/image-display";
import { OptionsPopover } from "@/components/posts/options-popover";
import { PostInterceptModal } from "@/components/posts/post-intercept-modal";
import Tag from "@/components/posts/tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { Folder, Link2, Ruler, User } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
interface InterceptedPostPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: InterceptedPostPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
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

  const tags =
    post?.tags
      .map((tag) => tag.name)
      .sort((a, b) => (a > b ? 1 : -1))
      .toString() || [].toString();
  const formattedTags = tags.replace(/,/g, ", ");

  return {
    title: `${formattedTags} - Post | Hello! Picboard`,
    description: post?.description || "Post on Hello! Picboard",
    openGraph: {
      images: {
        url: `${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${post?.sourceUrl}`,
        secureUrl: `${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${post?.sourceUrl}`,
      },
    },
    twitter: {
      card: "summary_large_image",
      site: "@davidguy__",
      title: `${formattedTags} - Post | Hello! Picboard`,
      description: post?.description || "Post on Hello! Picboard",
      creator: "@davidguy__",
      images: {
        url: `${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${post?.sourceUrl}`,
      },
    },
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
    },
  });

  if (!post) {
    notFound();
  }

  const avatarImageUrl = post.user?.image?.includes("avatars/")
    ? `${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${post.user.image}`
    : post.user?.image;

  return (
    <PostInterceptModal>
      <div className="fixed left-[50%] top-[50%] z-50 flex h-max max-h-[100dvh] w-max max-w-full translate-x-[-50%] translate-y-[-50%] flex-col divide-y lg:flex-row lg:divide-y-0">
        <ImageDisplay
          sourceUrl={post.sourceUrl}
          width={post.width}
          height={post.height}
        />
        <div className="relative flex w-full flex-shrink-0 flex-col gap-y-2 bg-background p-2 lg:w-80 lg:border-l lg:pb-0 lg:pl-2 lg:pr-0 lg:pt-2">
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
          <div className="flex flex-wrap gap-x-4 gap-y-1 lg:flex-col lg:gap-x-0 lg:gap-y-2">
            <DateDisplay date={post.createdAt} />
            <div className="flex items-end gap-2 text-sm text-muted-foreground">
              <Ruler className="h-4 w-4" />
              {post.width && post.height ? (
                <span>{`${post.width} x ${post.height}`}</span>
              ) : (
                <span className="italic text-muted-foreground">
                  No dimensions provided
                </span>
              )}
            </div>
            <div className="flex items-end gap-2 text-sm text-muted-foreground">
              <Folder className="h-4 w-4" />
              <span>
                {post.category.slice(0, 1).toUpperCase() +
                  post.category.slice(1)}
              </span>
            </div>
            {post.originUrl && (
              <div className="flex items-end gap-2 text-sm text-muted-foreground">
                <Link2 className="h-4 w-4" />
                <a
                  href={post.originUrl}
                  target="_blank"
                  className="text-blue-800 underline-offset-4 visited:text-purple-800 hover:underline dark:text-blue-500 dark:visited:text-purple-500"
                >
                  {new URL(post.originUrl).hostname}
                </a>
              </div>
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
    </PostInterceptModal>
  );
}
