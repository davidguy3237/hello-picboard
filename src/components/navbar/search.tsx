"use client";

import { searchTags } from "@/actions/search-tags";
import { Input } from "@/components/ui/input";
import { useDebounceFunction } from "@/hooks/use-debounce";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export function Search() {
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
    const searchbar = document.getElementById("search") as HTMLInputElement;

    if (searchbar) {
      const inputValueArray = searchbar.value
        .trim()
        .split(",")
        .map((word: string) => word.trim());

      inputValueArray.splice(inputValueArray.length - 1, 1, suggestion);

      const newInputValue = inputValueArray.join(", ");

      searchbar.value = newInputValue;

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

  // TODO: Maybe add search submit button so you don't have to hit enter

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
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
          <ul className="absolute z-10 mt-2 max-h-40 w-full overflow-scroll rounded-md border">
            {searchSuggestions.map((suggestion) => (
              <li key={suggestion}>
                <div
                  className="flex h-8 items-center bg-background pl-2 hover:cursor-pointer hover:bg-secondary"
                  // onClick={handleClick} // element disappears when input loses focus so this doesn't work
                  onMouseDown={() => handleClick(suggestion)} // apparently this triggers before input loses focus
                >
                  {suggestion}
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}
