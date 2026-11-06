"use client";

import { Button } from "@/components/shadcn/button";
import { IExamListItem } from "@/features/exams";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import ExamDialog from "@/components/dialog/exams/exam-dialog";

export default function ExamEditBtn({ exam }: { exam: IExamListItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
        <PencilIcon />
        Edit
      </Button>
      {isOpen && <ExamDialog open={isOpen} onOpenChange={setIsOpen} data={exam} />}
    </>
  );
}
