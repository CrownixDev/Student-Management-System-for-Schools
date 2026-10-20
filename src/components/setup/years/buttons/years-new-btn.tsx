"use client";

import YearDialog from "@/components/dialog/academic-years/year-dialog";
import { Button } from "@/components/shadcn/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function YearsNewBtn() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-1.5 shadow-xs">
        <PlusIcon className="size-4" />
        Add Academic Year
      </Button>
      {isOpen && <YearDialog open={isOpen} onOpenChange={setIsOpen} />}
    </>
  );
}
