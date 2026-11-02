"use client";

import ClassDetailsDialog from "@/components/dialog/class/class-details-dialog";
import { Button } from "@/components/shadcn/button";
import { IClass } from "@/features/class";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

export default function ClassEditBtn({ classData }: { classData: IClass }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <PencilIcon />
        Edit class
      </Button>
      {isOpen && (
        <ClassDetailsDialog
          open
          onOpenChange={setIsOpen}
          year={classData.academicYear}
          grade={classData.gradeLevel}
          data={classData}
        />
      )}
    </>
  );
}
