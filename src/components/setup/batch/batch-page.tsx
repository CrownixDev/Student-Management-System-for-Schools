"use client";

import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import BatchDialog from "@/components/dialog/batch/batch-dialog";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import { TypographyH1 } from "@/components/ui/typography";
import { IBatchListItem } from "@/features/batch";
import { filterParsers } from "@/lib/nuqs/filter";
import { LinkIcon, PlusIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import BatchTable from "./batch-table";

interface BatchPageProps {
  batches: IBatchListItem[];
}

export default function BatchPage({ batches }: BatchPageProps) {
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<IBatchListItem | null>(null);
  const [{ search }] = useQueryStates(filterParsers);

  function handleOpenAdd() {
    setEditingBatch(null);
    setIsBatchDialogOpen(true);
  }

  function handleOpenEdit(batch: IBatchListItem) {
    setEditingBatch(batch);
    setIsBatchDialogOpen(true);
  }

  return (
    <div className="flex flex-col overflow-y-auto p-8 space-y-6">
      <div className="flex w-full items-center justify-between gap-5">
        <TypographyH1 className="text-2xl font-bold tracking-tight">Batches</TypographyH1>
        <Button onClick={handleOpenAdd} className="gap-1.5 shadow-xs">
          <PlusIcon className="size-4" />
          Add Batch
        </Button>
      </div>

      <SearchInput placeholder="Search batches..." />

      <Separator />

      {batches.length > 0 ? (
        <BatchTable batches={batches} onEdit={handleOpenEdit} />
      ) : (
        <div className="py-12 border border-dashed rounded-xl border-border bg-card/40">
          <EmptyState
            icon={LinkIcon}
            title={search ? "No matching batches" : "No batches found"}
            description={
              search
                ? `No batches match "${search}". Try searching for another batch.`
                : "Batches group A/L classes across years. Get started by adding the first batch."
            }
          />
        </div>
      )}

      {/* Add / Edit Batch Dialog */}
      {isBatchDialogOpen && (
        <BatchDialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen} data={editingBatch} />
      )}
    </div>
  );
}
