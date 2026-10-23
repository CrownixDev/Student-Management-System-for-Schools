"use client";

import ClassStudentDialog from "@/components/dialog/class/class-student-dialog";
import { Button } from "@/components/shadcn/button";
import { IClass } from "@/features/class";
import { IStudentsListItem } from "@/features/students";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";

export default function ClassStudentAddBtn({ classData }: { classData: IClass }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleAddStudents(students: IStudentsListItem[]) {
    console.log(students);
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
          classData={classData}
          onAddStudents={handleAddStudents}
        />
      )}
    </>
  );
}
