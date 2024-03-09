"use client";

import { Aperture } from "lucide-react";
import Link from "next/link";

export function HomeButton() {
  return (
    <Link href="/home" className="flex items-center">
      <span className="rounded-full border p-1 text-xl font-medium lg:hidden">
        H!P
      </span>
      <span className="hidden text-xl font-medium lg:block">
        Hello! Picboard
      </span>
    </Link>
  );
}
