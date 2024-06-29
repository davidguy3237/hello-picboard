"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  label: string;
  href: string;
}

export function BackButton({ label, href }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.replace(href);
  };

  return (
    <Button
      variant="link"
      className="w-full font-normal"
      size="sm"
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
