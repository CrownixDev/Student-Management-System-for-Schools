"use client";

import SetAsCurrentYearDialog from "@/components/dialog/academic-years/set-as-current-year-dialog";
import { Button } from "@/components/shadcn/button";
import { IAcademicYear } from "@/features/academic-years";
import { CheckCircle2Icon } from "lucide-react";

export default function YearsSetCurrentBtn({ year }: { year: IAcademicYear }) {
  if (year.isCurrent) {
    return (
      <Button size="sm" variant="ghost" disabled>
        <CheckCircle2Icon />
        Current
      </Button>
    );
  }
  return <SetAsCurrentYearDialog year={year} />;
}
