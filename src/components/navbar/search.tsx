"use client";

import { searchTags } from "@/actions/search-tags";
import { Input } from "@/components/ui/input";
import { useDebounceFunction } from "@/hooks/use-debounce";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { SearchFilter } from "./search-filter";
import { DateRange } from "react-day-picker";

export function Search() {
  // TODO: Search input should probably be set in state, but currently can't get it to work properly
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShowDropdown(true);
    const inputValue = e.target.value;
    const inputValueArray = inputValue
      .trim()
      .split(",")
      .map((word) => word.trim());
    const lastSearchValue = inputValueArray[inputValueArray.length - 1];
    if (lastSearchValue.length >= 3) {
      searchTags(lastSearchValue).then((data) => {
        if (data.error) {
          setSearchSuggestions([]);
        } else if (data.success) {
          const results = data.success.map((tag) => tag.value);
          setSearchSuggestions(results);
        }
      });
    } else {
      setSearchSuggestions([]);
    }
  };

  const debouncedHandleChange = useDebounceFunction(handleChange, 500);

  const handleClick = (suggestion: string) => {
    const searchBar = document.getElementById("search") as HTMLInputElement;

    if (searchBar) {
      const inputValueArray = searchBar.value
        .trim()
        .split(",")
        .map((word: string) => word.trim());

      inputValueArray.splice(inputValueArray.length - 1, 1, suggestion);

      const newInputValue = inputValueArray.join(", ");

      searchBar.value = newInputValue;

      setSearchSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & { search: { value: string } };
    const searchValue = target.search.value;

    const params = new URLSearchParams(searchParams);

    if (searchValue.length >= 3) {
      params.set("q", searchValue);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleStrictSearch = () => {};

  // TODO: Maybe add search submit button so you don't have to hit enter

  return (
    <div className="relative mx-auto flex w-full max-w-screen-sm">
      <form onSubmit={handleSubmit} className="relative flex flex-1 gap-x-2">
        <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for posts..."
          type="search"
          minLength={3}
          className="peer flex-grow pl-8 placeholder:italic"
          name="search"
          onChange={debouncedHandleChange}
          defaultValue={searchParams.get("q")?.toString()}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
          id="search"
        />
        {searchSuggestions.length > 0 && showDropdown && (
          <div className="absolute z-10 mt-2 h-fit w-full">
            <ScrollArea className="rounded-md border bg-background">
              <ul className="max-h-40 w-full">
                {searchSuggestions.map((suggestion) => {
                  const searchBar = document.getElementById(
                    "search",
                  ) as HTMLInputElement;
                  if (searchBar) {
                    const inputValueArray = searchBar.value
                      .trim()
                      .split(",")
                      .map((word: string) => word.trim());
                    if (!inputValueArray.includes(suggestion)) {
                      return (
                        <li
                          key={suggestion}
                          onMouseDown={() => handleClick(suggestion)}
                          className="flex h-8 items-center pl-2 hover:cursor-pointer hover:bg-secondary"
                        >
                          {suggestion}
                        </li>
                      );
                    }
                  }
                })}
              </ul>
            </ScrollArea>
          </div>
        )}
        <SearchFilter />
      </form>
    </div>
  );
}
