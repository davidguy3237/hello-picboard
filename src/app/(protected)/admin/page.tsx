import { currentUser } from "@/lib/auth";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reports } from "./components/reports";
import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin - Hello! Picboard",
};

export default async function AdminPage() {
  // TODO: Add admin page
  const user = await currentUser();
  if (!user) {
    notFound();
  } else if (user.role !== "ADMIN") {
    notFound();
  }

  const reports = await db.report.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
    include: {
      post: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return <Reports reports={reports} />;
}
