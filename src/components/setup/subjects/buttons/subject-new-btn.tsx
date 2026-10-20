"use client";

import SubjectDialog from "@/components/dialog/subject/subject-dialog";
import { Button } from "@/components/shadcn/button";
import { SubjectCategory } from "@/generated/prisma/enums";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function SubjectNewBtn({ category }: { category: SubjectCategory }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-1.5">
        <PlusIcon className="size-4" />
        Add Subject
      </Button>
      {open && <SubjectDialog open={open} onOpenChange={setOpen} data={{ category }} />}
    </>
  );
}
