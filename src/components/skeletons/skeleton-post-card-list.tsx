import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export function PostCardListSkeleton({ classNames }: { classNames?: string }) {
  return (
    <div className="flex w-full flex-row flex-wrap justify-center gap-1">
      {[...Array(20)].map((x, i) => (
        <div
          key={i}
          className="relative flex h-96 w-72 flex-auto items-center justify-center overflow-hidden bg-secondary sm:rounded-sm"
        >
          <div className="group h-full w-full">
            <Skeleton className="h-full w-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
