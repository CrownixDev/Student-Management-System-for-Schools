"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { IBatchListItem } from "@/features/batch";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import RenderDialogErrors from "../compoennts/render-dialog-errors";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { StrictOmit } from "@/lib/utils";
import { batchTypeOptions } from "@/features/batch/batch.enums";

interface BatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IBatchListItem | null;
}

export default function BatchDialog({ open, onOpenChange, data }: BatchDialogProps) {
  const isEditing = Boolean(data?.id);

  const [badgeData, setBadgeData] = useState<StrictOmit<IBatchListItem, "id">>({
    name: data?.name ?? "",
    type: data?.type ?? "al",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleSubmit() {
    const newErrors: string[] = [];

    if (!badgeData.name.trim()) {
      newErrors.push("Batch name is required (e.g. '2026').");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = { id: data?.id, name: badgeData.name.trim() };
    console.log("Saving batch:", payload);
    onOpenChange(false);
  }

  function handleDelete() {
    console.log("Deleting batch:", data?.id);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Batch" : "Add Batch"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <RenderDialogErrors errors={errors} />

            <FieldGroup className="space-y-3">
              <Field>
                <FieldLabel htmlFor="batch-name">Batch Name</FieldLabel>
                <Input
                  id="batch-name"
                  placeholder="e.g. 2026"
                  value={badgeData.name}
                  onChange={(e) => setBadgeData((prevData) => ({ ...prevData, name: e.target.value }))}
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="batch-name">Batch Type</FieldLabel>
                <Select
                  items={batchTypeOptions}
                  value={badgeData.type}
                  onValueChange={(value) => setBadgeData((prevData) => ({ ...prevData, type: value ?? "al" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {batchTypeOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <div className="flex min-w-full items-center">
              {isEditing && (
                <Button
                  variant="destructive"
                  size="icon"
                  title="Delete batch"
                  type="button"
                  onClick={() => setIsDeleting(true)}
                >
                  <TrashIcon />
                </Button>
              )}
              <div className="flex flex-1 gap-3 justify-end">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  {isEditing ? "Save Changes" : "Create Batch"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={isDeleting}
        onOpenChange={setIsDeleting}
        title="Delete Batch"
        description="Are you sure you want to delete this batch? Deleting a batch will remove the batch grouping from all associated classes."
        itemIdentifier={data ? `Batch ${data.name}` : undefined}
        confirmationPhrase="Yes i wanted to delete"
        onConfirm={handleDelete}
      />
    </>
  );
}
