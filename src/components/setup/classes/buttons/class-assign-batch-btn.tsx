"use client";

import GradeBatchDialog from "@/components/dialog/class/grade-batch-dialog";
import TooltipButton from "@/components/ui/tooltip-button";
import { IGradeWithClassesItem } from "@/features/grades";
import { LinkIcon } from "lucide-react";
import { useState } from "react";

export default function ClassAssignBatchBtn({ grade }: { grade: IGradeWithClassesItem }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <TooltipButton
        tooltip="Assign classes to a batch"
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      >
        <LinkIcon />
      </TooltipButton>
      {isOpen && <GradeBatchDialog open={isOpen} onOpenChange={setIsOpen} grade={grade} />}
    </>
  );
}
