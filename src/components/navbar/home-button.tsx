"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { Aperture } from "lucide-react";

export function HomeButton() {
  return (
    <Link href="/home" className="flex items-center">
      <Aperture className=" mr-2 h-8 w-8" />
      <span className="hidden text-xl sm:inline-block">Home</span>
    </Link>
  );
}
