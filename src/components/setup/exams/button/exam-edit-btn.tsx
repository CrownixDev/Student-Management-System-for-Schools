"use client";

import ExamDialog, { IExamDialogData } from "@/components/dialog/exams/exam-dialog";
import { Button } from "@/components/shadcn/button";
import { IAcademicYear } from "@/features/academic-years";
import { IExamListItem } from "@/features/exams";
import { IGradeListItem } from "@/features/grades";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

export default function ExamEditBtn({
  year,
  grade,
  exam,
}: {
  year: IAcademicYear;
  grade: IGradeListItem;
  exam: IExamListItem;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSaveExam(data: IExamDialogData) {
    console.log(data);
  }

  function handleDeleteExam() {}

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
        <PencilIcon />
        Edit
      </Button>
      <ExamDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        academicYear={year}
        gradeLevel={grade}
        initialData={exam}
        onSave={handleSaveExam}
        onDeleteExam={handleDeleteExam}
      />
    </>
  );
}
