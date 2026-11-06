"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { useState } from "react";
import { IGradeWithClassesItem } from "@/features/grades";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/shadcn/field";
import { EditIcon,  XIcon } from "lucide-react";
import { IBatchListItem } from "@/features/batch";
import { updateClassBatchAction } from "@/features/class/class.actions";
import { toast } from "react-toastify";
import BatchPickerDialog from "../batch-picker-dialog";

export default function ClassBatchDialog({
  grade,
  open,
  onOpenChange,
}: {
  grade: IGradeWithClassesItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [batch, setBatch] = useState<IBatchListItem | null>(() => grade.batch);
  const [isBatchPickerOpen, setIsBatchPickerOpen] = useState(false);

  async function continueAssignment() {
    const res = await updateClassBatchAction(batch?.id ?? null, grade.id);
    if (res.success) {
      toast.success(res.message);
      onOpenChange(false);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90dvh] flex-col overflow-hidden min-w-md">
          <DialogHeader className="shrink-0">
            <DialogTitle>Assign a batch to {grade.name}</DialogTitle>
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
                  <Button size="sm" variant="outline" onClick={() => setIsBatchPickerOpen(true)}>
                    <EditIcon />
                    {batch ? "Change" : "Assign"}
                  </Button>
                </div>
              </Field>
            </FieldSet>
          </FieldGroup>
          <DialogFooter className="shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={continueAssignment}>
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
