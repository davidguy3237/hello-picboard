import { SettingsForm } from "@/app/(protected)/settings/components/settings-form";
import { currentUser } from "@/lib/auth";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings - Hello! Picboard",
};

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) {
    notFound();
  }
  return <SettingsForm user={user} />;
}
