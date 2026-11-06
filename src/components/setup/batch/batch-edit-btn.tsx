"use client";
import BatchDialog from "@/components/dialog/batch/batch-dialog";
import TooltipButton from "@/components/ui/tooltip-button";
import { IBatchListItem } from "@/features/batch";
import { EditIcon } from "lucide-react";
import { useState } from "react";

export default function BatchEditBtn({ batch }: { batch: IBatchListItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TooltipButton tooltip="Edit batch" size="icon-sm" variant="ghost" onClick={() => setIsOpen(true)}>
        <EditIcon />
      </TooltipButton>
      {isOpen && <BatchDialog open={isOpen} onOpenChange={setIsOpen} data={batch} />}
    </>
  );
}
