"use client";

import { IAcademicYear } from "@/features/academic-years";
import SetupSidebarHearder from "../setup-sidebar-hearder";
import ClassGradeDialog from "@/components/dialog/class/class-grade-dialog";
import { useState } from "react";

export default function ClassSidebarHeader({ year }: { year: IAcademicYear }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SetupSidebarHearder
        header={{ title: `All Grades (${year.name})` }}
        action={{
          btnLabel: "Add new Grade",
          onAction: () => setIsOpen(true),
        }}
      />
      {isOpen && <ClassGradeDialog open onOpenChange={setIsOpen} year={year} />}
    </>
  );
}
