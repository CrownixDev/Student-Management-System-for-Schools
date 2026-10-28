"use client";

import StudentDetailsDialog from "@/components/dialog/students/student-details-dialog";
import { Button } from "@/components/shadcn/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function StudentsNewBtn() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Add new Student
      </Button>
      {isOpen && <StudentDetailsDialog open={isOpen} onOpenChange={setIsOpen} />}
    </>
  );
}
