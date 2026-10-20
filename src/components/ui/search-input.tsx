"use client";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/shadcn/input-group";
import { filterParsers } from "@/lib/nuqs/filter";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useTransition } from "react";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const [isPending, startTransition] = useTransition();
  const [{ search }, SetParsers] = useQueryStates(filterParsers, { startTransition });

  return (
    <InputGroup>
      <InputGroupAddon>{isPending ? <Loader2Icon className="animate-spin" /> : <SearchIcon />}</InputGroupAddon>
      <InputGroupInput
        value={search ?? ""}
        onChange={(e) => SetParsers({ search: e.target.value, page: null })}
        placeholder={placeholder}
      />
      <InputGroupButton size={"sm"} onClick={() => SetParsers({ search: null })}>
        Clear
      </InputGroupButton>
    </InputGroup>
  );
}
