import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function SkeletonAlbumCardList() {
  return (
    <>
      {[...Array(24)].map((x, i) => (
        <Card key={i} className="h-60 w-60 overflow-hidden">
          <CardContent className="h-full w-full p-0">
            <Skeleton className="h-full w-full bg-muted" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
