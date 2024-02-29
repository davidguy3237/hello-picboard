import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import db from "@/lib/db";
import { User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface UserPageProps {
  params: {
    username: string;
  };
}

export default async function DefaultUserPage({ params }: UserPageProps) {
  const username = params.username;
  const user = await db.user.findUnique({
    where: {
      name: username,
    },
  });

  console.log("THIS IS THE DEFAULT USER PAGE");

  if (!user) {
    notFound();
  }

  return (
    <div className="flex w-full max-w-screen-2xl items-center justify-self-start">
      <Avatar className="mx-2 h-40 w-40">
        <AvatarImage src={user.image || ""} />
        <AvatarFallback className="bg-foreground">
          <User className="text-background" />
        </AvatarFallback>
      </Avatar>
      <div className="text-5xl font-bold">{username}</div>
    </div>
  );
}
