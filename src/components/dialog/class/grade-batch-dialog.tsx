"use client";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { useState } from "react";
import { IGradeWithClassesItem } from "@/features/grades";
import { Field, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/shadcn/field";
import { BackpackIcon, PencilIcon } from "lucide-react";
import RenderDialogErrors from "../compoennts/render-dialog-errors";
import EmptyState from "@/components/ui/empty-state";
import BatchPickerDialog from "../batch-picker-dialog";
import { IBatchListItem } from "@/features/batch";
import { Badge } from "@/components/shadcn/badge";

export default function GradeBatchDialog({
  grade,
  open,
  onOpenChange,
}: {
  grade: IGradeWithClassesItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>(() =>
    grade.classes.map((classItem) => classItem.id),
  );
  const [batch, setBatch] = useState<IBatchListItem>();
  const [errors, setErrors] = useState<string[]>([]);
  const [isBatchPickerOpen, setIsBatchPickerOpen] = useState(false);

  function toggleClass(classId: string, checked: boolean) {
    setSelectedClassIds((current) => (checked ? [...current, classId] : current.filter((id) => id !== classId)));
  }

  function continueAssignment() {
    if (!batch) {
      setErrors(["Select a batch to continue."]);
      return;
    }

    if (selectedClassIds.length === 0) {
      setErrors(["Select at least one class to continue."]);
      return;
    }

    console.log({
      gradeId: grade.id,
      batch,
      classIds: selectedClassIds,
    });
    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90dvh] flex-col overflow-hidden sm:max-w-lg">
          <DialogHeader className="shrink-0">
            <DialogTitle>Assign {grade.name} classes to a batch</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <FieldSet>
              <FieldLabel>Batch</FieldLabel>
              <Field>
                <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-sm">{batch?.name ?? "No batch assigned"}</span>
                  <Button type="button" size="sm" variant="outline" onClick={() => setIsBatchPickerOpen(true)}>
                    <PencilIcon />
                    Assign
                  </Button>
                </div>
              </Field>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <Field orientation="horizontal">
                <FieldLabel>Classes</FieldLabel>
                <Button
                  disabled={grade.classes.length === 0}
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setSelectedClassIds((current) =>
                      current.length === grade.classes.length ? [] : grade.classes.map((item) => item.id),
                    )
                  }
                >
                  {selectedClassIds.length === grade.classes.length ? "Clear all" : "Select all"}
                </Button>
              </Field>
              <FieldGroup className="divide-y h-60 rounded-md border overflow-y-auto gap-0">
                {grade.classes.map((classItem) => (
                  <Field key={classItem.id} orientation="horizontal" className="px-3 py-2.5">
                    <Checkbox
                      id={classItem.id}
                      checked={selectedClassIds.includes(classItem.id)}
                      onCheckedChange={(checked) => toggleClass(classItem.id, checked === true)}
                    />
                    <FieldLabel htmlFor={classItem.id} className="flex w-full justify-between">
                      <span>{classItem.name}</span>
                      <div className="flex gap-3">
                        <Badge variant="outline">{classItem.batch?.name}</Badge>
                        <span className="text-xs text-muted-foreground">{classItem.studentCount} students</span>
                      </div>
                    </FieldLabel>
                  </Field>
                ))}
                {grade.classes.length === 0 && (
                  <EmptyState
                    icon={BackpackIcon}
                    title="No classes available"
                    description="There are no classes to assign to a batch."
                  />
                )}
              </FieldGroup>
            </FieldSet>
            <RenderDialogErrors errors={errors} />
          </FieldGroup>
          <DialogFooter className="shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={continueAssignment}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isBatchPickerOpen && (
        <BatchPickerDialog
          open={isBatchPickerOpen}
          onOpenChange={setIsBatchPickerOpen}
          onSelect={(batch) => setBatch(batch)}
        />
      )}
    </>
  );
}
