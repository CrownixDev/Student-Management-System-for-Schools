"use client";

import ExportResultsDialog from "@/components/dialog/exams/export-results-dialog";
import { Button } from "@/components/shadcn/button";
import { IClassListWithSubjectsItem } from "@/features/class";
import { IExamListItem, IExamTopResults } from "@/features/exams";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";

export default function ExportResultsBtn({
  exam,
  results,
  classesWithSubjects,
}: {
  exam: IExamListItem;
  results: IExamTopResults;
  classesWithSubjects: IClassListWithSubjectsItem[];
}) {
  const [isOpen, setisOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setisOpen(true)}>
        Export
        <DownloadIcon />
      </Button>
      {isOpen && (
        <ExportResultsDialog
          open
          onOpenChange={setisOpen}
          results={results}
          classesWithSubjects={classesWithSubjects}
          exam={exam}
        />
      )}
    </>
  );
}
