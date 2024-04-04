import { cn } from "@/lib/utils";
import Select from "react-select";

interface CategoryOption {
  value: string;
  label: string;
}

interface CategorySelectProps {
  disabled?: boolean;
  defaultValue?: CategoryOption;
  onChangeFromForm: (...event: any[]) => void;
}

export function CategorySelect({
  disabled,
  defaultValue,
  onChangeFromForm,
}: CategorySelectProps) {
  const categoryOptions = [
    { value: "twitter", label: "Twitter" },
    { value: "instagram", label: "Instagram" },
    { value: "blog", label: "Blog" },
    { value: "goods", label: "Goods" },
    { value: "news", label: "News" },
    { value: "magazine", label: "Magazine" },
    { value: "photobook", label: "Photobook" },
    { value: "website", label: "Website" },
    { value: "other", label: "Other" },
  ];

  return (
    <Select
      placeholder="Select a category"
      isDisabled={disabled}
      isClearable
      defaultValue={defaultValue}
      options={categoryOptions}
      onChange={(value) => onChangeFromForm(value?.value)}
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
