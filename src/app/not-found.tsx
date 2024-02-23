import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-2">
      <h1 className="text-9xl font-black">404</h1>
      <h2 className="text-4xl font-bold">Not Found</h2>
      <p className="text-lg">
        The page you&apos;re looking for could not be found
      </p>
      <Link href="/home" className="">
        <Button size="lg">Return Home</Button>
      </Link>
    </div>
  );
}
