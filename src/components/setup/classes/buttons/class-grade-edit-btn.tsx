"use client";

import { IGradeListItem } from "@/features/grades";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import ClassGradeDialog from "@/components/dialog/class/class-grade-dialog";
import TooltipButton from "@/components/ui/tooltip-button";

export default function ClassGradeEditBtn({ grade }: { grade: IGradeListItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TooltipButton
        tooltip="Edit this grade"
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      >
        <PencilIcon />
      </TooltipButton>
      {isOpen && <ClassGradeDialog open onOpenChange={setIsOpen} data={grade} />}
    </>
  );
}
