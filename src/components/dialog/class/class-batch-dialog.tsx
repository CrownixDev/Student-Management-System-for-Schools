"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { useState } from "react";
import { IGradeWithClassesItem } from "@/features/grades";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/shadcn/field";
import { EditIcon, XIcon } from "lucide-react";
import { IBatchListItem } from "@/features/batch";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rpcTanStack } from "@/lib/orpc/client";
import { revalidateCache } from "@/lib/actions";
import { isDefinedError } from "@orpc/client";
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
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    rpcTanStack.class.updateBatch.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.batch.key() });
        toast.success(batch?.id ? "Batch assigned successfully" : "Batch removed successfully");
        onOpenChange(false);
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Unknow error occured");
        }
      },
    }),
  );

  return (
    <>
      <Dialog open={open} onOpenChange={createMutation.isPending ? undefined : onOpenChange}>
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setBatch(null)}
                      disabled={createMutation.isPending}
                    >
                      <XIcon />
                      Remove
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsBatchPickerOpen(true)}
                    disabled={createMutation.isPending}
                  >
                    <EditIcon />
                    {batch ? "Change" : "Assign"}
                  </Button>
                </div>
              </Field>
            </FieldSet>
          </FieldGroup>
          <DialogFooter className="shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() =>
                createMutation.mutateAsync({
                  batchId: batch?.id ?? null,
                  gradeId: grade.id,
                })
              }
              disabled={createMutation.isPending}
            >
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
