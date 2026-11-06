"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Label } from "@/components/shadcn/label";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { IGradeListItem } from "@/features/grades";
import { getGradesListAction } from "@/features/grades/grades.actions";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, GraduationCapIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { GRADE_OPTIONS } from "@/lib/query-keys";
import { IAcademicYear } from "@/features/academic-years";
import EmptyState from "@/components/ui/empty-state";
import LoadingIndicator from "@/components/ui/loading-indicator";
import SearchInput from "@/components/ui/search-input";

export default function GradePickerDialog({
  open,
  onOpenChange,
  selectedGradeId,
  onSelect,
  year,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGradeId?: string;
  onSelect: (grade: IGradeListItem) => void;
  year: IAcademicYear;
}) {
  const [search, setSearch] = useState("");
  const [gradeId, setGradeId] = useState(selectedGradeId ?? "");

  const { data: grades = [], isPending } = useQuery({
    enabled: open,
    queryFn: async () => {
      const result = await getGradesListAction({ yearId: year.id, search: search.trim() || null });
      if (!result.success) {
        toast.error(result.message);
        throw new Error(result.message);
      }
      return result.data;
    },
    queryKey: [GRADE_OPTIONS, search, year.id],
  });

  function confirmSelection() {
    const grade = grades.find((item) => item.id === gradeId);
    if (!grade) return;
    onSelect(grade);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex min-w-md flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Select grade</DialogTitle>
        </DialogHeader>
        <SearchInput placeholder="Search grades" value={search} onChange={setSearch} onClear={() => setSearch("")} />
        {isPending ? (
          <LoadingIndicator />
        ) : (
          <div className="max-h-[45dvh] flex-1 overflow-y-auto rounded-md border">
            <RadioGroup value={gradeId} onValueChange={setGradeId}>
              {grades.map((grade) => (
                <div key={grade.id} className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0">
                  <RadioGroupItem value={grade.id} id={`grade-${grade.id}`} />
                  <Label className="flex-1 cursor-pointer" htmlFor={`grade-${grade.id}`}>
                    {grade.name}
                  </Label>
                  {gradeId === grade.id && <CheckIcon className="size-4 shrink-0 text-muted-foreground" />}
                </div>
              ))}
            </RadioGroup>
            {grades.length === 0 && (
              <EmptyState
                noBorder
                icon={GraduationCapIcon}
                title="No grades found"
                description={search ? "Try a different search." : "There are no grades available."}
              />
            )}
          </div>
        )}
        <DialogFooter className="shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!gradeId} onClick={confirmSelection}>
            Select grade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
