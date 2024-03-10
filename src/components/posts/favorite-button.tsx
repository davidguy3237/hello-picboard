"use client";

import { favoritePost } from "@/actions/posts";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  postId: string;
  isInvisible?: boolean;
  classNames?: string;
}

export function FavoriteButton({
  postId,
  isInvisible,
  classNames,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState<boolean>(false);

  useEffect(() => {
    const getFavoriteState = async () => {
      const res = await fetch(`/api/check-favorite/post?postId=${postId}`, {
        method: "GET",
      });

      const data = await res.json();
      if (data.favorite) {
        setFavorited(true);
      } else {
        setFavorited(false);
      }
    };

    getFavoriteState();
  }, [postId]);

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
        "absolute left-0 top-0 h-8 w-8 rounded-full bg-transparent text-foreground hover:bg-transparent hover:text-red-500 active:scale-90",
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
