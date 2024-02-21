"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className=" shrink-0">
          <SlidersHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-10 mt-2 flex h-fit w-60 flex-col gap-y-2 rounded-lg border bg-background p-2">
        <div className="flex h-10 items-center justify-between rounded-lg border px-3 py-2">
          <Label
            htmlFor="terms"
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Strict Search
          </Label>
          <Checkbox id="terms" />
        </div>
        <Select onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Oldest</SelectItem>
            <SelectItem value="desc">Newest</SelectItem>
          </SelectContent>
        </Select>
        <DatePickerWithRange className="w-full" />
      </PopoverContent>
    </Popover>
  );
}
