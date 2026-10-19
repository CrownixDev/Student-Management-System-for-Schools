"use client";

import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import SearchInput from "@/components/ui/search-input";
import { TypographyH1 } from "@/components/ui/typography";
import { PlusIcon } from "lucide-react";

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
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex flex-col gap-3">
        <TypographyH1>{header.title}</TypographyH1>
        <Button variant={"outline"} className={"w-full"} onClick={header.onAction}>
          <PlusIcon />
          {header.actionBtnlabel}
        </Button>
      </div>

      <SearchInput placeholder={search.placeholder} />

      <Separator />
    </div>
  );
}
