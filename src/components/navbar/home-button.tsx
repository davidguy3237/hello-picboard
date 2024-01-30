"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { Aperture } from "lucide-react";

export function HomeButton() {
  return (
    <Link href="/home" className="mr-4 flex items-center">
      <Aperture className=" mr-2 h-8 w-8" />
      <span className="text-xl">Home</span>
    </Link>
  );
}
