"use client";

import ExamDialog from "@/components/dialog/exams/exam-dialog";
import { Button } from "@/components/shadcn/button";
import { IAcademicYear } from "@/features/academic-years";
import { IGradeListItem } from "@/features/grades";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function ExamNewBtn({ grade }: { year: IAcademicYear; grade: IGradeListItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Add exam
      </Button>
      {isOpen && <ExamDialog open={isOpen} onOpenChange={setIsOpen} grade={grade} />}
    </>
  );
}
