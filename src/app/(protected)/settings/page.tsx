import { SettingsForm } from "@/components/settings-form";
import { currentUser } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) {
    notFound();
  }
  return <SettingsForm user={user} />;
}
