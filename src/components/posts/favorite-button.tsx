"use client";

import { favoritePost } from "@/actions/posts";
import useCurrentUser from "@/hooks/use-current-user";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  postId: string;
  isFavorited: boolean;
  isInvisible?: boolean;
  classNames?: string;
}

export function FavoriteButton({
  postId,
  isFavorited,
  isInvisible,
  classNames,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState<boolean>(isFavorited);

  const user = useCurrentUser();

  if (!user) return null;

  const handleClick = async () => {
    const originalFavoriteState = favorited;
    setFavorited(!favorited);

    const favoritePostResults = await favoritePost(postId, favorited);

    if (!favoritePostResults.success) {
      setFavorited(originalFavoriteState);
      toast.error(favoritePostResults.error);
    } else if (favoritePostResults.success) {
    }
  };
  return (
    <Button
      size="icon"
      className={cn(
        "absolute left-0 top-0 bg-transparent text-foreground hover:bg-transparent hover:text-red-500 active:scale-90",
        isInvisible && "invisible group-hover:visible",
        classNames,
      )}
      onClick={handleClick}
    >
      {favorited ? (
        <Heart className="fill-red-500 text-red-500" />
      ) : (
        <Heart className="" />
      )}
    </Button>
  );
}
