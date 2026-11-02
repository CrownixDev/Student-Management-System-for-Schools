"use client";

import ClassStudentDialog from "@/components/dialog/class/class-student-dialog";
import { Button } from "@/components/shadcn/button";
import { IClass } from "@/features/class";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";

export default function ClassStudentAddBtn({ classData }: { classData: IClass }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <UserPlusIcon />
        Enrollments
      </Button>
      {isOpen && <ClassStudentDialog open onOpenChange={setIsOpen} classData={classData} />}
    </>
  );
}
