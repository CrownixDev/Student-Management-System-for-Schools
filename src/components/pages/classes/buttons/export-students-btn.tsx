"use client";

import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { IClass } from "@/features/class";
import ExportStudentsDialog from "@/components/dialog/class/export-students-dialog";

export default function ExportStudentsBtn({ classData }: { classData: IClass }) {
  const [isOpen, setisOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setisOpen(true)}>
        Export
        <DownloadIcon />
      </Button>
      {isOpen && <ExportStudentsDialog open={isOpen} onOpenChange={setisOpen} classData={classData} />}
    </>
  );
}
