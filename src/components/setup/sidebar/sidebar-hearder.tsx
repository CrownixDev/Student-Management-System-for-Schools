"use client";

import { Button } from "@/components/shadcn/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/shadcn/input-group";
import { Separator } from "@/components/shadcn/separator";
import { TypographyH1 } from "@/components/ui/typography";
import { filterParsers } from "@/lib/nuqs/filter";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useQueryStates } from "nuqs";

interface Props {
  header: {
    title: string;
    actionBtnlabel: string;
    onAction: () => void;
  };
  search: {
    placeholder: string;
  };
}

export default function SidebarHearder({ header, search }: Props) {
  const [{ search: seachValue }, SetParsers] = useQueryStates(filterParsers);

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex flex-col gap-3">
        <TypographyH1>{header.title}</TypographyH1>
        <Button variant={"outline"} className={"w-full"} onClick={header.onAction}>
          <PlusIcon />
          {header.actionBtnlabel}
        </Button>
      </div>

      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={seachValue ?? ""}
          onChange={(e) => SetParsers({ search: e.target.value, page: null })}
          placeholder={search.placeholder}
        />
        <InputGroupButton size={"sm"} onClick={() => SetParsers({ search: null })}>
          Clear
        </InputGroupButton>
      </InputGroup>

      <Separator />
    </div>
  );
}
