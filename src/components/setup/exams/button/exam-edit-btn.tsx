"use client";

import ExamDialog from "@/components/dialog/exams/exam-dialog";
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

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
        <PencilIcon />
        Edit
      </Button>
      {isOpen && <ExamDialog open={isOpen} onOpenChange={setIsOpen} year={year} grade={grade} data={exam} />}
    </>
  );
}
