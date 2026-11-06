"use client";

import SubjectDialog from "@/components/dialog/subject/subject-dialog";
import TooltipButton from "@/components/ui/tooltip-button";
import { ISubjectListItem } from "@/features/subjects";
import { EditIcon } from "lucide-react";
import { useState } from "react";

export default function SubjectEditBtn({ subject }: { subject: ISubjectListItem }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TooltipButton tooltip="Edit Subject" size="icon" variant="ghost" onClick={() => setOpen(true)}>
        <EditIcon />
      </TooltipButton>
      {open && <SubjectDialog data={subject} open={open} onOpenChange={setOpen} />}
    </>
  );
}
