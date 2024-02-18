"use client";

import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface PaginationSectionProps {
  postsPerPage: number;
  currentPage: number;
  totalPostsCount: number | null;
}

export function PaginationSection({
  postsPerPage,
  currentPage,
  totalPostsCount,
}: PaginationSectionProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = totalPostsCount
    ? Math.ceil(totalPostsCount / postsPerPage)
    : 1;
  let pagesArray = [];
  for (let i = 1; i <= totalPages; i++) {
    pagesArray.push(i);
  }

  const previousLinkParams = new URLSearchParams(searchParams);
  const nextLinkParams = new URLSearchParams(searchParams);

  previousLinkParams.set("p", (currentPage - 1).toString());
  nextLinkParams.set("p", (currentPage + 1).toString());

  if (currentPage <= 1) {
    previousLinkParams.delete("p");
  } else if (currentPage >= totalPages) {
    nextLinkParams.set("p", currentPage.toString());
  }

  const previousLink = pathname + "?" + previousLinkParams.toString();
  const nextLink = pathname + "?" + nextLinkParams.toString();

  return (
    <Pagination className="mt-4 pb-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={previousLink}
            prefetch={false}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {totalPages > 1 &&
          pagesArray.map((page) => {
            const pageLinkParams = new URLSearchParams(searchParams);
            pageLinkParams.set("p", page.toString());
            const pageLink = pathname + "?" + pageLinkParams.toString();
            return (
              page >= currentPage - 2 &&
              page <= currentPage + 2 && (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    href={pageLink}
                    prefetch={false}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            );
          })}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href={nextLink}
            prefetch={false}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={cn(
              currentPage >= totalPages && "pointer-events-none opacity-50",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
