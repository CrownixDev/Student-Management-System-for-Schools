"use client";

import { Button } from "@/components/shadcn/button";
import { IAcademicYear } from "@/features/academic-years";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import GradeDialog from "@/components/dialog/grades/grade-dialog";

export default function GradesNewBtn({ year }: { year: IAcademicYear }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="gap-1.5 shadow-xs" onClick={() => setOpen(true)}>
        <PlusIcon className="size-4" />
        Add Grade
      </Button>
      {open && <GradeDialog open={open} onOpenChange={setOpen} year={year} />}
    </>
  );
}
