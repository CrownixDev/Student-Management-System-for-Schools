"use client";

import ClassDetailsDialog, { IClassDetailsDialogData } from "@/components/dialog/class/class-details-dialog";
import { Button } from "@/components/shadcn/button";
import { IAcademicYear } from "@/features/academic-years";
import { IGradeWithClassesItem } from "@/features/grades";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function ClassNewBtn({ year, grade }: { year: IAcademicYear; grade: IGradeWithClassesItem }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleAddClass(data: IClassDetailsDialogData) {
    console.log(data);
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon />
        Add new class
      </Button>
      {isOpen && <ClassDetailsDialog open onOpenChange={setIsOpen} year={year} grade={grade} onSave={handleAddClass} />}
    </>
  );
}
