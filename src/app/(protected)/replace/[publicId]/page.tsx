/* eslint-disable @next/next/no-img-element */
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReplaceForm } from "./components/replace";

interface ReplacePageProps {
  params: {
    publicId: string;
  };
}

export const metadata: Metadata = {
  title: "Replace - Hello! Picboard",
};

// THIS IS A STOP GAP UNTIL A BETTER FEATURE IS IMPLEMENTED
export default async function ReplacePage({ params }: ReplacePageProps) {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const post = await db.post.findUnique({
    where: {
      publicId: params.publicId,
    },
    include: {
      tags: true,
    },
  });

  if (!post) {
    notFound();
  } else if (post.userId !== user.id && user.role !== "ADMIN") {
    notFound();
  }

  return <ReplaceForm post={post} />;
}
