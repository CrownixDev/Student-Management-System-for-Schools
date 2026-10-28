"use client";

import StudentDetailsDialog from "@/components/dialog/students/student-details-dialog";
import { Button } from "@/components/shadcn/button";
import { IStudentProfile } from "@/features/students";
import { EyeIcon } from "lucide-react";
import { useState } from "react";

export default function StudentsEditBtn({ student }: { student: IStudentProfile }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <EyeIcon />
        View
      </Button>
      {isOpen && <StudentDetailsDialog open={isOpen} onOpenChange={setIsOpen} data={student} />}
    </>
  );
}
