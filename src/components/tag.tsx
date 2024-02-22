"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { badgeVariants } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface TagProps {
  name: string;
}

export default function Tag({ name }: TagProps) {
  const pathname = usePathname();

  return (
    <Link
      href={`/home?query=${name}`}
      prefetch={false}
      className={cn("flex-shrink-0", badgeVariants({ variant: "default" }))}
    >
      {name}
    </Link>
  );
}
