"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export function Social() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("cbu");
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size="lg"
        className="w-full space-x-2"
        variant="outline"
        onClick={() => {
          onClick("google");
        }}
      >
        <FcGoogle className="h-5 w-5" />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
}
