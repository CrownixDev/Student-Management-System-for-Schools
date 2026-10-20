"use client";

import GradeDialog from "@/components/dialog/grades/grade-dialog";
import { Button } from "@/components/shadcn/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function GradesNewBtn() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="gap-1.5 shadow-xs" onClick={() => setOpen(true)}>
        <PlusIcon className="size-4" />
        Add Grade
      </Button>
      {open && <GradeDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
