"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export function FilterButton() {
  const handleClick = () => {
    console.log("FILTER BUTTON CLICKED");
    // TODO: IMPLEMENT FILTER OPTIONS
  };
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      className=" shrink-0"
    >
      <SlidersHorizontal />
    </Button>
  );
}
