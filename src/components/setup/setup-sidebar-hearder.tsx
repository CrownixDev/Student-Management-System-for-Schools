"use client";

import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import SearchInput from "@/components/ui/search-input";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { PlusIcon } from "lucide-react";

interface Props {
  header: {
    title: string;
    description?: string;
  };
  action?: {
    btnLabel: string;
    onAction: () => void;
  };
  search?: {
    placeholder: string;
  };
}

export default function SetupSidebarHearder({ header, action, search }: Props) {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex flex-col gap-3">
        <div>
          <TypographyH1>{header.title}</TypographyH1>
          {header.description && <TypographyP>{header.description}</TypographyP>}
        </div>
        {action && (
          <Button variant={"outline"} className={"w-full"} onClick={action.onAction}>
            <PlusIcon />
            {action.btnLabel}
          </Button>
        )}
      </div>

      {search && <SearchInput placeholder={search.placeholder} />}

      <Separator />
    </div>
  );
}
