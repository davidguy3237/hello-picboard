"use client";

import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700", "900"] });

export function HomeButton() {
  return (
    <a href="/home" className={cn("flex items-center", poppins.className)}>
      <span className="rounded-full p-1 text-2xl font-bold lg:hidden">H!P</span>
      <span className={"hidden text-xl font-bold lg:block"}>
        Hello! Picboard
      </span>
    </a>
  );
}
