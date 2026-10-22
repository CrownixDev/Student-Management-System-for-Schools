"use client";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/shadcn/input-group";
import { filterParsers } from "@/lib/nuqs/filter";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useTransition } from "react";

export default function SearchInput({
  placeholder,
  value,
  onChange,
  onClear,
}: {
  placeholder: string;
  value?: string;
  onChange?: (search: string) => void;
  onClear?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [{ search }, SetParsers] = useQueryStates(filterParsers, { startTransition });

  return (
    <InputGroup>
      <InputGroupAddon>{isPending ? <Loader2Icon className="animate-spin" /> : <SearchIcon />}</InputGroupAddon>
      <InputGroupInput
        value={value ? value : (search ?? "")}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          } else {
            SetParsers({ search: e.target.value, page: null });
          }
        }}
        placeholder={placeholder}
      />
      <InputGroupButton
        size={"sm"}
        onClick={() => {
          if (onClear) {
            onClear();
          } else {
            SetParsers({ search: null });
          }
        }}
      >
        Clear
      </InputGroupButton>
    </InputGroup>
  );
}
