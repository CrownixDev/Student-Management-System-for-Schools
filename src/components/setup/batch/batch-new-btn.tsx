"use client";

import BatchDialog from "@/components/dialog/batch/batch-dialog";
import { Button } from "@/components/shadcn/button";
import { batchTabParsers } from "@/features/batch/batch.cache";
import { PlusIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useState } from "react";

export default function BatchAddNewBtn() {
  const [{ tab }] = useQueryStates(batchTabParsers);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-1.5 shadow-xs">
        <PlusIcon className="size-4" />
        Add Batch
      </Button>
      {isOpen && <BatchDialog key={tab} open={isOpen} onOpenChange={setIsOpen} data={{ type: tab }} />}
    </>
  );
}
