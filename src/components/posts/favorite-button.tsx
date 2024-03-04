"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { favoritePost } from "@/actions/favorite-post";
import useCurrentUser from "@/hooks/use-current-user";
import { toast } from "sonner";

interface FavoriteButtonProps {
  postId: string;
  isFavorited: boolean;
}

export function FavoriteButton({ postId, isFavorited }: FavoriteButtonProps) {
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
      className="invisible absolute left-0 top-0 bg-transparent text-muted-foreground hover:bg-transparent hover:text-red-500 active:scale-90 group-hover:visible"
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
