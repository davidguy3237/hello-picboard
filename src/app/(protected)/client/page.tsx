"use client";
import { UserInfo } from "@/components/user-info";
import useCurrentUser from "@/hooks/use-current-user";
import { currentUser } from "@/lib/auth";

export default function ClientPage() {
  const user = useCurrentUser();
  return <UserInfo user={user} label="Client Component" />;
}
