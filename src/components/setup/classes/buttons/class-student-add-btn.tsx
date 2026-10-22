"use client";

import ClassStudentDialog from "@/components/dialog/class/class-student-dialog";
import { Button } from "@/components/shadcn/button";
import { IEnrolledStudentItem } from "@/components/setup/classes/classes.types";
import { IClass } from "@/features/class";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";

export default function ClassStudentAddBtn({ classData }: { classData: IClass }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSaveSelection(selection: {
    keepEnrollmentIds: string[];
    addStudents: IEnrolledStudentItem[];
  }) {
    console.log(selection);
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <UserPlusIcon />
        Add students
      </Button>
      {isOpen && (
        <ClassStudentDialog
          open
          onOpenChange={setIsOpen}
          className={classData.name}
          currentEnrollments={classData.enrollments}
          currentEnrollmentCount={classData.enrollments.length}
          onSaveSelection={handleSaveSelection}
        />
      )}
    </>
  );
}
