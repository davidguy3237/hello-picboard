import { useDebounceFunction } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  GroupBase,
  InputActionMeta,
  InputProps,
  MultiValue,
  components,
} from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import type {} from "react-select/base";

declare module "react-select/base" {
  export interface Props<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>,
  > {
    onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  }
}

interface TagOption {
  value: string;
  label: string;
}

interface CustomAsyncCreatableSelectProps {
  onChangeFromForm: (...event: any[]) => void;
  disabled?: boolean;
  defaultValue?: TagOption[];
}

const customInput = (props: InputProps<TagOption, true>) => {
  return (
    <div>
      {props.children}
      <components.Input {...props} onPaste={props.selectProps.onPaste} />
    </div>
  );
};

export function CustomAsyncCreatableSelect({
  onChangeFromForm,
  disabled,
  defaultValue,
}: CustomAsyncCreatableSelectProps) {
  const [value, setValue] = useState<TagOption[]>(defaultValue || []);
  const [inputValue, setInputValue] = useState<string>("");

  const fetchOptionsCallback = (
    inputValue: string,
    callback: (options: TagOption[]) => void,
  ) => {
    if (inputValue.length >= 3 && inputValue.length <= 40) {
      fetch(`/api/tags?tag=${inputValue}`).then((res) => {
        if (!res.ok) {
          callback([]);
        } else {
          res.json().then((data) => {
            callback(data);
          });
        }
      });
    }
  };

  const debouncedFetchOptions = useDebounceFunction(fetchOptionsCallback, 200);

  const onChange = (options: MultiValue<TagOption>) => {
    setValue(options as TagOption[]);
    setInputValue("");
    if (options === null) {
      onChangeFromForm(null);
    } else {
      onChangeFromForm(options.map((tag) => tag.value));
    }
  };

  const onInputChange = (
    onChangeFromForm: (...event: any[]) => void,
    textInput: string,
    { action }: InputActionMeta,
  ) => {
    if (action === "input-change") {
      if (textInput && textInput.endsWith(",")) {
        const label = textInput.slice(0, -1); // trim off comma

        if (label.length >= 3 && label.length <= 40) {
          const newValue = { label, value: label };
          setValue([...value, newValue]);
          onChangeFromForm([...value, newValue].map((tag) => tag.value));
          setInputValue("");
        } else {
          setInputValue(label);
        }
      } else {
        setInputValue(textInput);
      }
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.clipboardData?.getData("text/plain")) {
      const tags = e.clipboardData
        .getData("text/plain")
        .split(",")
        .map((tag) => ({
          value: tag.trim(),
          label: tag.trim(),
        }))
        .filter((tag) =>
          value.every(
            (existingTag) =>
              existingTag.value.toLowerCase() !== tag.value.toLowerCase(),
          ),
        );
      setValue([...value, ...tags]);
      onChangeFromForm([...value, ...tags].map((tag) => tag.value));
      setInputValue("");

      // TODO: Not sure if I want to implement this. It's to limit the number of potential duplicates due to incorrect lowercasing/uppercasing, but lots of fetches required
      // const promises = [];
      // for (const tag of tags) {
      //   promises.push(
      //     fetch(`/api/tags?tag=${tag.value}`).then((res) => {
      //       if (res.ok) {
      //         res.json().then((data) => {
      //           for (const existingTag of data) {
      //             if (
      //               existingTag.value.toLowerCase() === tag.value.toLowerCase()
      //             ) {
      //               tag.value = existingTag.value;
      //               tag.label = existingTag.label;
      //             }
      //           }
      //         });
      //       }
      //     }),
      //   );
      // }
      // Promise.allSettled(promises).then(() => {
      //   setValue([...(value || []), ...tags]);
      //   onChangeFromForm([...(value || []), ...tags].map((tag) => tag.value));
      //   setInputValue("");
      // });
    }
  };

  const customPlaceholder = () => {
    return (
      <span className="absolute text-sm italic text-muted-foreground">
        Add tags
      </span>
    );
  };

  return (
    <AsyncCreatableSelect<TagOption, true>
      placeholder="Add tags"
      isDisabled={disabled}
      isMulti
      isClearable
      loadOptions={debouncedFetchOptions}
      inputValue={inputValue}
      value={value}
      onInputChange={(...args) => onInputChange(onChangeFromForm, ...args)}
      onChange={onChange}
      components={{ Input: customInput, Placeholder: customPlaceholder }}
      onPaste={onPaste}
      onBlur={() => setInputValue("")}
      unstyled
      classNames={{
        control: ({ isFocused }) =>
          cn("border rounded-sm px-1", isFocused && "ring-ring ring-2"),
        container: () => "bg-background",
        placeholder: () => "text-muted-foreground text-sm italic",
        dropdownIndicator: ({ isFocused }) =>
          cn(
            "pl-1 text-muted-foreground hover:text-foreground border-l",
            isFocused && "text-foreground",
          ),
        option: ({ isFocused }) =>
          cn("bg-background p-1 rounded-sm", isFocused && "bg-accent"),
        noOptionsMessage: () => "p-1",
        multiValue: () => "rounded-sm bg-accent overflow-hidden m-0.5",
        multiValueLabel: () => "px-1",
        multiValueRemove: () => "hover:bg-destructive/80 px-0.5",
        clearIndicator: () =>
          "text-muted-foreground hover:text-foreground px-1",
        menuList: () => "bg-background border p-1 mt-2 rounded-sm shadow-lg",
      }}
    />
  );
}
