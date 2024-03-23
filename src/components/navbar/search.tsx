"use client";

import { SearchFilter } from "@/components/navbar/search-filter";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import { Input } from "@/components/ui/input";
import { useDebounceFunction } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { SearchSchema } from "@/schemas";
import { Loader2, SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { DateRange } from "react-day-picker";

interface TagOption {
  value: string;
  label: string;
}

export function Search() {
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isStrictSearch, setIsStrictSearch] = useState<boolean | undefined>();
  const [sortBy, setSortBy] = useState<"asc" | "desc" | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const inputValueArray = inputValue
      .trim()
      .split(",")
      .map((word) => word.trim());
    const lastSearchValue = inputValueArray[inputValueArray.length - 1];
    if (lastSearchValue.length >= 3) {
      startTransition(async () => {
        const res = await fetch(`/api/tags?tag=${lastSearchValue}`);
        if (!res.ok) {
          setSearchSuggestions([]);
        } else {
          const data = await res.json();
          const results = data.map((tag: TagOption) => tag.value);
          setSearchSuggestions(results);
        }
      });
    } else {
      setSearchSuggestions([]);
    }
  };

  const debouncedHandleChange = useDebounceFunction(handleChange, 200);

  const handleClick = (suggestion: string) => {
    if (inputRef.current) {
      const inputValueArray = inputRef.current.value
        .trim()
        .split(",")
        .map((word) => word.trim());

      inputValueArray.splice(inputValueArray.length - 1, 1, suggestion);

      const newInputValue = inputValueArray?.join(", ") + ", ";
      inputRef.current.value = newInputValue;
      setSearchSuggestions([]);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    const searchObj = {
      query: inputRef.current?.value || undefined,
      isStrictSearch,
      sortBy,
      dateRange,
    };

    const validatedFields = SearchSchema.safeParse(searchObj);
    if (validatedFields.success) {
      const { query, isStrictSearch, sortBy, dateRange } = validatedFields.data;
      const params = new URLSearchParams();
      params.set("query", query || "");
      if (isStrictSearch) {
        params.set("strict", isStrictSearch.toString());
      }
      if (sortBy) {
        params.set("sort", sortBy);
      }
      if (dateRange) {
        params.set("from", dateRange.from.toISOString());
        dateRange.to && params.set("to", dateRange.to.toISOString());
      }

      if (pathname.includes("/post/")) {
        router.push(`/home?${params.toString()}`);
      } else {
        router.replace(`${pathname}?${params.toString()}`);
      }
    } else if (validatedFields.error) {
      console.error(validatedFields.error);
    }
  };

  const handleStrictSearch = (value: boolean) => {
    setIsStrictSearch(value);
  };

  const handleSortBy = (value: string) => {
    if (value === "asc" || value === "desc" || value === undefined) {
      setSortBy(value);
    } else {
      setSortBy(undefined);
    }
  };

  const navigateSuggestions = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === "ArrowDown") {
      e.preventDefault();
      if (searchSuggestions.length > 0) {
        setSelectedSuggestion((prev) => {
          if (prev === searchSuggestions.length - 1) {
            return 0;
          } else {
            return prev + 1;
          }
        });
      }
    }

    if (key === "ArrowUp") {
      e.preventDefault();
      if (searchSuggestions.length > 0) {
        setSelectedSuggestion((prev) => {
          if (prev === 0) {
            return searchSuggestions.length - 1;
          } else {
            return prev - 1;
          }
        });
      }
    }

    if (key === "Enter") {
      e.preventDefault();
      if (inputRef.current) {
        const inputValueArray = inputRef.current.value
          .trim()
          .split(",")
          .map((word) => word.trim());

        const lastSearchValue = inputValueArray[inputValueArray.length - 1];

        if (lastSearchValue.length === 0) {
          handleSubmit();
        } else if (searchSuggestions.length > 0) {
          const suggestion = searchSuggestions[selectedSuggestion];
          handleClick(suggestion);
        }
      }
    }
  };

  if (pathname.includes("/albums") || pathname.includes("/favorites")) {
    return null;
  }

  return (
    <div className="relative flex w-full max-w-screen-sm gap-x-2">
      <form
        onSubmit={handleSubmit}
        className="relative w-full"
        autoComplete="off"
      >
        <Button
          size="icon"
          variant="link"
          type="submit"
          aria-label="Search"
          className="absolute right-0 top-0 text-muted-foreground hover:text-foreground"
        >
          <SearchIcon strokeWidth={3} />
        </Button>
        <Input
          ref={inputRef}
          id="search"
          name="search"
          placeholder="Search for tags"
          minLength={3}
          onChange={debouncedHandleChange}
          defaultValue={searchParams.get("query")?.toString()}
          onKeyDown={navigateSuggestions}
          onBlur={() => {
            setSelectedSuggestion(0);
          }}
          className="peer flex-grow pr-10 placeholder:italic"
        />
        <div
          className={cn(
            "invisible absolute mt-1 flex h-9 w-full items-center justify-center rounded-md border bg-background",
            isPending && "peer-focus:visible",
          )}
        >
          <Loader2 className="animate-spin" />
        </div>
        <div
          className={cn(
            "invisible absolute mt-1 flex min-h-9 w-full flex-wrap items-center rounded-md border bg-background text-sm italic text-muted-foreground",
            searchSuggestions.length === 0 &&
              !isPending &&
              "peer-focus:visible",
          )}
        >
          <p className="pl-2">Separate each tag with a comma.</p>
        </div>
        <div
          className={cn(
            "invisible absolute mt-1 h-fit w-full",
            searchSuggestions.length > 0 && !isPending && "peer-focus:visible",
          )}
        >
          <div className="rounded-md border bg-background">
            <ul className="w-full">
              {searchSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleClick(suggestion);
                  }}
                  className={cn(
                    "flex h-8 items-center pl-2 text-sm hover:cursor-pointer hover:bg-secondary",
                    selectedSuggestion === index && "bg-secondary",
                  )}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </form>
      <SearchFilter
        isStrictSearch={isStrictSearch}
        handleStrictSearch={handleStrictSearch}
        sortBy={sortBy}
        handleSortBy={handleSortBy}
      >
        <DatePickerWithRange
          className="w-full"
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </SearchFilter>
    </div>
  );
}
