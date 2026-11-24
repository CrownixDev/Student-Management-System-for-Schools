"use client";

import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { CheckIcon, CircleUserIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IClassList, IClassListItem } from "@/features/class";
import { IGradeListItem } from "@/features/grades";
import { rpcTanStack } from "@/lib/orpc/client";
import GradePickerDialog from "@/components/dialog/grade-picker-dialog";
import EmptyState from "@/components/ui/empty-state";
import LoadingIndicator from "@/components/ui/loading-indicator";

export default function ClassPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (data: IClassList) => void;
}) {
  const [grade, setGrade] = useState<IGradeListItem | null>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<IClassList>([]);

  const { data: activeYear, isPending: isLoadingYear } = useQuery(
    rpcTanStack.academicYear.getActiveYear.queryOptions({
      enabled: open,
    }),
  );

  const { data: classList, isPending: isLoadingClasses } = useQuery(
    rpcTanStack.class.getList.queryOptions({
      enabled: open && !!grade && !isLoadingYear && !!activeYear,
      input: { gradeId: grade?.id ?? "" },
    }),
  );

  function changeOpen(open: boolean) {
    onOpenChange(open);
    if (!open) {
      setGrade(null);
      setSelectedClasses([]);
    }
  }

  function toggleClass(classItem: IClassListItem) {
    setSelectedClasses((current) =>
      current.some((item) => item.id === classItem.id)
        ? current.filter((item) => item.id !== classItem.id)
        : [...current, classItem],
    );
  }

  function confirmSelection() {
    onSelect(selectedClasses);
    changeOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent className="min-w-lg">
          <DialogHeader>
            <DialogTitle>Assign a class</DialogTitle>
            <DialogDescription>Choose a grade, then select classes</DialogDescription>
          </DialogHeader>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => setGradeDialogOpen(true)}
          >
            <UsersIcon />
            <span className="flex-1 text-left">{grade?.name ?? "Choose a grade"}</span>
            <span className="text-xs text-muted-foreground">Select grade</span>
          </Button>
          {grade && isLoadingClasses ? (
            <LoadingIndicator />
          ) : grade && classList ? (
            <div className="max-h-[40dvh] overflow-y-auto rounded-md border">
              {classList.length > 0 &&
                classList.map((classItem) => {
                  return (
                    <button
                      key={classItem.id}
                      type="button"
                      className="flex w-full items-center justify-between border-b px-3 py-3 text-left last:border-b-0 hover:bg-muted"
                      onClick={() => toggleClass(classItem)}
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-medium">{classItem.name}</span>
                        {selectedClasses.some((item) => item.id === classItem.id) && (
                          <CheckIcon className="size-4 text-primary" />
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CircleUserIcon size={15} />
                        {classItem.studentCount}
                      </span>
                    </button>
                  );
                })}
              {classList.length === 0 && (
                <EmptyState
                  noBorder
                  icon={UsersIcon}
                  title="No classes available"
                  description={`${grade.name} do not have any classes for ${activeYear?.name} academic year`}
                />
              )}
            </div>
          ) : (
            <EmptyState
              noBorder
              icon={UsersIcon}
              title="Choose a grade first"
              description="The available classes will appear here."
            />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => changeOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={selectedClasses.length === 0} onClick={confirmSelection}>
              Assign {selectedClasses.length > 0 ? `${selectedClasses.length} ` : ""}class
              {selectedClasses.length === 1 ? "" : "es"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {gradeDialogOpen && activeYear && (
        <GradePickerDialog
          open={gradeDialogOpen}
          onOpenChange={setGradeDialogOpen}
          selectedGradeId={grade?.id}
          year={activeYear}
          onSelect={(selectedGrade) => setGrade(selectedGrade)}
        />
      )}
    </>
  );
}
