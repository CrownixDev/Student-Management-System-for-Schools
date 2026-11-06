"use client";

import AcademicYearDialog from "@/components/dialog/academic-years/year-dialog";
import TooltipButton from "@/components/ui/tooltip-button";
import { IAcademicYear } from "@/features/academic-years";
import { EditIcon } from "lucide-react";
import { useState } from "react";

export default function YearsEditBtn({ year }: { year: IAcademicYear }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TooltipButton tooltip="Edit academic year" size="icon-sm" variant="ghost" onClick={() => setOpen(true)}>
        <EditIcon />
      </TooltipButton>
      {open && <AcademicYearDialog open={open} onOpenChange={setOpen} data={year} />}
    </>
  );
}
