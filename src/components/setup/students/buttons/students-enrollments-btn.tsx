"use client";

import { Button } from "@/components/shadcn/button";
import { IStudentProfile } from "@/features/students";
import { WaypointsIcon } from "lucide-react";
import { useState } from "react";
import StudentEnrollmentsDialog from "@/components/dialog/students/student-enrollments-dialog";

export default function StudentsEnrollmentsBtn({ student }: { student: IStudentProfile }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <WaypointsIcon />
        Enrollments
      </Button>
      {isOpen && <StudentEnrollmentsDialog open={isOpen} onOpenChange={setIsOpen} student={student} />}
    </>
  );
}
