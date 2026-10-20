"use client";

import BatchDialog from "@/components/dialog/batch/batch-dialog";
import { Button } from "@/components/shadcn/button";
import { batchTabParsers } from "@/features/batch/batch.cache";
import { PlusIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useState } from "react";

export default function BatchAddNewBtn() {
  const [{ tab }] = useQueryStates(batchTabParsers);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);

  function handleOpenAdd() {
    setIsBatchDialogOpen(true);
  }

  return (
    <>
      <Button onClick={handleOpenAdd} className="gap-1.5 shadow-xs">
        <PlusIcon className="size-4" />
        Add Batch
      </Button>
      <BatchDialog key={tab} open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen} data={{ type: tab }} />
    </>
  );
}
