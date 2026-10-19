"use client";

import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { IMediumItem } from "@/components/dialog/medium/medium-dialog";
import MediumDialog from "@/components/dialog/medium/medium-dialog";
import MediumTable from "./medium-table";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import { TypographyH1 } from "@/components/ui/typography";
import { filterParsers } from "@/lib/nuqs/filter";
import { Languages, PlusIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useState } from "react";

interface MediumPageProps {
  mediums: IMediumItem[];
}

export default function MediumPage({ mediums }: MediumPageProps) {
  const [isMediumDialogOpen, setIsMediumDialogOpen] = useState(false);
  const [editingMedium, setEditingMedium] = useState<IMediumItem | null>(null);
  const [{ search }] = useQueryStates(filterParsers);

  function handleOpenAdd() {
    setEditingMedium(null);
    setIsMediumDialogOpen(true);
  }

  function handleOpenEdit(medium: IMediumItem) {
    setEditingMedium(medium);
    setIsMediumDialogOpen(true);
  }

  return (
    <div className="flex flex-col overflow-y-auto p-8 space-y-6">
      <div className="flex w-full items-center justify-between gap-5">
        <TypographyH1 className="text-xl lg:text-2xl font-bold tracking-tight">Medium</TypographyH1>
        <Button onClick={handleOpenAdd} className="gap-1.5 shadow-xs">
          <PlusIcon className="size-4" />
          Add Medium
        </Button>
      </div>

      <SearchInput placeholder="Search mediums..." />

      <Separator />

      {mediums.length > 0 ? (
        <MediumTable mediums={mediums} onEdit={handleOpenEdit} />
      ) : (
        <div className="py-12 border border-dashed rounded-xl border-border bg-card/40">
          <EmptyState
            noBorder
            icon={Languages}
            title={search ? "No matching mediums" : "No mediums found"}
            description={
              search
                ? `No mediums match "${search}". Try a different name.`
                : "Get started by adding the first teaching medium (e.g. Sinhala, English)."
            }
          />
        </div>
      )}

      {isMediumDialogOpen && (
        <MediumDialog open={isMediumDialogOpen} onOpenChange={setIsMediumDialogOpen} data={editingMedium} />
      )}
    </div>
  );
}
