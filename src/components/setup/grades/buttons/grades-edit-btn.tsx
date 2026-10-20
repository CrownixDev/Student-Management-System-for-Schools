"use client";

import GradeDialog from "@/components/dialog/grades/grade-dialog";
import TooltipButton from "@/components/ui/tooltip-button";
import { IGradeListItem } from "@/features/grades";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

export default function GradesEditBtn({ grade }: { grade: IGradeListItem }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TooltipButton tooltip="Edit grade" size="icon-sm" variant="ghost" onClick={() => setOpen(true)}>
        <PencilIcon />
      </TooltipButton>
      {open && <GradeDialog open={open} onOpenChange={setOpen} data={grade} />}
    </>
  );
}
