import { Suspense } from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <Suspense>{children}</Suspense>
    </div>
  );
}
