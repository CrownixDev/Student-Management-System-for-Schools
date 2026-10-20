"use client";

import SubjectDialog from "@/components/dialog/subject/subject-dialog";
import { Button } from "@/components/shadcn/button";
import { ISubject } from "@/features/subjects";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

export default function SubjectEditBtn({ subject }: { subject: ISubject }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <PencilIcon className="size-4" aria-hidden="true" />
        Edit subject
      </Button>
      {open && <SubjectDialog data={subject} open={open} onOpenChange={setOpen} />}
    </>
  );
}
