"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { badgeVariants } from "../ui/badge";

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
