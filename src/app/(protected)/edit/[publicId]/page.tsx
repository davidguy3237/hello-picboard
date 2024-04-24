import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { EditPostForm } from "./components/edit-post-form";

interface EditPostPageProps {
  params: {
    publicId: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
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

  return <EditPostForm post={post} />;
}
