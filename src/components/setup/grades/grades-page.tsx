"use client";

import { Button } from "@/components/shadcn/button";
import { TypographyH1 } from "@/components/ui/typography";
import { GraduationCapIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useQueryStates } from "nuqs";
import { filterParsers } from "@/lib/nuqs/filter";
import { IGradeListItem } from "@/features/grades";
import { Separator } from "@/components/shadcn/separator";
import GradeDialog from "@/components/dialog/grades/grade-dialog";
import GradesTable from "./grades-table";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";

export default function GradesPage({ grades }: { grades: IGradeListItem[] }) {
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<IGradeListItem | null>(null);
  const [{ search }] = useQueryStates(filterParsers);

  function handleOpenAdd() {
    setEditingGrade(null);
    setIsGradeDialogOpen(true);
  }

  function handleOpenEdit(grade: IGradeListItem) {
    setEditingGrade(grade);
    setIsGradeDialogOpen(true);
  }

  return (
    <div className="flex flex-col overflow-y-auto p-8 space-y-6">
      <div className="flex w-full items-center justify-between gap-5">
        <TypographyH1 className="text-xl lg:text-2xl font-bold tracking-tight">Grades</TypographyH1>
        <Button onClick={handleOpenAdd} className="gap-1.5 shadow-xs">
          <PlusIcon className="size-4" />
          Add Grade
        </Button>
      </div>

      <SearchInput placeholder="Search grades..." />

      <Separator />

      {grades.length > 0 ? (
        <GradesTable grades={grades} onEdit={handleOpenEdit} />
      ) : (
        <div className="py-12 border border-dashed rounded-xl border-border bg-card/40">
          <EmptyState
            icon={GraduationCapIcon}
            title={search ? "No matching grades" : "No grades found"}
            description={
              search
                ? `No grades match "${search}". Try searching for another grade.`
                : "Get started by adding the first grade."
            }
          />
        </div>
      )}

      {/* Add / Edit Grade Dialog */}
      {isGradeDialogOpen && (
        <GradeDialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen} data={editingGrade} />
      )}
    </div>
  );
}
