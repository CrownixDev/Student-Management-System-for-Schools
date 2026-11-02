"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { useState } from "react";
import { IGradeWithClassesItem } from "@/features/grades";
import { Field, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/shadcn/field";
import { BackpackIcon, PencilIcon, XIcon } from "lucide-react";
import { IBatchListItem } from "@/features/batch";
import EmptyState from "@/components/ui/empty-state";
import BatchPickerDialog from "../batch-picker-dialog";
import { updateClassBatchAction } from "@/features/class/class.actions";
import { toast } from "react-toastify";

export default function ClassBatchDialog({
  grade,
  open,
  onOpenChange,
}: {
  grade: IGradeWithClassesItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [batch, setBatch] = useState<IBatchListItem | null>(
    () => grade.classes.find((cls) => cls.batch)?.batch || null,
  );
  const [isBatchPickerOpen, setIsBatchPickerOpen] = useState(false);

  async function continueAssignment() {
    const classIds = grade.classes.map((cls) => cls.id);
    const res = await updateClassBatchAction(batch?.id ?? null, classIds);
    if (res.success) {
      toast.success(res.message);
      onOpenChange(false);
    } else {
      toast.error(res.message);
    }
  }

  const assignDisabled = grade.classes.length === 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90dvh] flex-col overflow-hidden min-w-md">
          <DialogHeader className="shrink-0">
            <DialogTitle>Assign {grade.name} classes to a batch</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <FieldSet>
              <FieldLabel>Batch</FieldLabel>
              <Field>
                <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-sm">{batch?.name ?? "No batch assigned"}</span>
                  {batch && (
                    <Button size="sm" variant="ghost" onClick={() => setBatch(null)}>
                      <XIcon />
                      Remove
                    </Button>
                  )}
                  <Button
                    disabled={assignDisabled}
                    size="sm"
                    variant="outline"
                    onClick={() => setIsBatchPickerOpen(true)}
                  >
                    <PencilIcon />
                    {batch ? "Change" : "Assign"}
                  </Button>
                </div>
              </Field>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLabel>Classes</FieldLabel>
              <FieldGroup className="divide-y max-h-[20dvh] rounded-md border overflow-y-auto gap-0">
                {grade.classes.map((classItem) => (
                  <Field key={classItem.id} orientation="horizontal" className="px-3 py-2.5">
                    <FieldLabel className="flex w-full justify-between">
                      <span>{classItem.name}</span>
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
          </FieldGroup>
          <DialogFooter className="shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={continueAssignment} disabled={assignDisabled}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isBatchPickerOpen && (
        <BatchPickerDialog
          open={isBatchPickerOpen}
          onOpenChange={setIsBatchPickerOpen}
          onSelect={setBatch}
          selectedBatchId={batch?.id}
        />
      )}
    </>
  );
}
