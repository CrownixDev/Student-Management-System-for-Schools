"use client";

import SubjectDialog from "@/components/dialog/subject/subject-dialog";
import TooltipButton from "@/components/ui/tooltip-button";
import { ISubjectListItem } from "@/features/subjects";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

export default function SubjectEditBtn({ subject }: { subject: ISubjectListItem }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TooltipButton tooltip="Edit Subject" size="icon" variant="ghost" onClick={() => setOpen(true)}>
        <PencilIcon />
      </TooltipButton>
      {open && <SubjectDialog data={subject} open={open} onOpenChange={setOpen} />}
    </>
  );
}
