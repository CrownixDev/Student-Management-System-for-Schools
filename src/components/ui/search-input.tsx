import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/shadcn/input-group";
import { filterParsers } from "@/lib/nuqs/filter";
import { SearchIcon } from "lucide-react";
import { useQueryStates } from "nuqs";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const [{ search }, SetParsers] = useQueryStates(filterParsers);

  return (
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
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
