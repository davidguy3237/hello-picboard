"use client";

import { Aperture } from "lucide-react";
import Link from "next/link";

export function HomeButton() {
  return (
    <Link href="/home" className="flex items-center gap-x-2" prefetch={false}>
      <Aperture className="h-8 w-8" />
      <span className="hidden text-xl sm:inline-block">Home</span>
    </Link>
  );
}
