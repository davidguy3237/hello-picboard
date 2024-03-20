import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export function PostCardListSkeleton({ classNames }: { classNames?: string }) {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-1 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
      {[...Array(40)].map((x, i) => (
        <div
          key={i}
          className="relative flex h-32 flex-auto items-center justify-center overflow-hidden bg-muted sm:rounded-sm md:h-60 md:rounded-sm lg:h-96"
        >
          <div className="group h-full w-full">
            <Skeleton className="h-full w-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
