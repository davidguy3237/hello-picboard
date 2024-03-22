import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopoverContent } from "@radix-ui/react-popover";
import { SlidersHorizontal } from "lucide-react";

interface SearchFilterProps {
  children: React.ReactNode;
  isStrictSearch: boolean | undefined;
  handleStrictSearch: (value: boolean) => void;
  sortBy: "asc" | "desc" | undefined;
  handleSortBy: (value: string) => void;
}

export function SearchFilter({
  children,
  isStrictSearch,
  handleStrictSearch,
  sortBy,
  handleSortBy,
}: SearchFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className=" shrink-0 active:bg-background"
          aria-label="Search Filters"
        >
          <SlidersHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-10 mt-2 flex h-fit w-72 flex-col gap-y-2 rounded-lg border bg-background p-2">
        <div className="flex h-10 items-center justify-between rounded-lg border px-3 py-2">
          <Label
            htmlFor="strictSearch"
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Strict Search
          </Label>
          <Checkbox
            id="strictSearch"
            onCheckedChange={handleStrictSearch}
            checked={isStrictSearch}
          />
        </div>
        <Select onValueChange={handleSortBy} value={sortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
        {children}
      </PopoverContent>
    </Popover>
  );
}
