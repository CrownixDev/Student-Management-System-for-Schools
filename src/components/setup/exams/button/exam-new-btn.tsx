"use client";

import ExamDialog, { IExamDialogData } from "@/components/dialog/exams/exam-dialog";
import { Button } from "@/components/shadcn/button";
import { IAcademicYear } from "@/features/academic-years";
import { IGradeListItem } from "@/features/grades";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function ExamNewBtn({ year, grade }: { year: IAcademicYear; grade: IGradeListItem }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSaveExam(data: IExamDialogData) {
    console.log(data);
  }

  return (
    <>
      <Button className="shrink-0" onClick={() => setIsOpen(true)}>
        <PlusIcon className="size-4" />
        Add exam
      </Button>
      <ExamDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        academicYear={year}
        gradeLevel={grade}
        onSave={handleSaveExam}
      />
    </>
  );
}
