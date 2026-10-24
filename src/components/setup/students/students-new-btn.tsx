"use client";

import StudentDetailsDialog from "@/components/dialog/students/student-details-dialog";
import { Button } from "@/components/shadcn/button";
import { IStudentProfile } from "@/features/students";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function StudentsNewBtn() {
  const [isOpen, setIsOpen] = useState(false);

  function handleCreate(data: IStudentProfile) {
    console.log(data);
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Add new Student
      </Button>
      <StudentDetailsDialog open={isOpen} onOpenChange={setIsOpen} onSave={handleCreate} />
    </>
  );
}
