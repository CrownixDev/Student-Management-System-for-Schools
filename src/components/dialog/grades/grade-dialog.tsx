"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { useState } from "react";
import { IGradeListItem } from "@/features/grades";
import { StrictOmit } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
import RenderDialogErrors from "../../ui/dialog/render-dialog-errors";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";

export default function GradeDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Partial<IGradeListItem> | null;
  onSave?: Partial<IGradeListItem>;
}) {
  const isEditing = Boolean(data?.id);
  const [formData, setFormData] = useState<StrictOmit<IGradeListItem, "id">>({
    number: data?.number ?? 1,
    name: data?.name ?? (data?.number ? `Grade ${data.number}` : "Grade 1"),
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleNumberChange(val: string) {
    const num = parseInt(val, 10);
    const newNum = isNaN(num) ? 0 : num;
    setFormData((prev) => {
      // Auto-update name if it's empty or matches standard "Grade X" pattern
      const isDefaultName = !prev.name || prev.name.startsWith("Grade ");
      return {
        ...prev,
        number: newNum,
        name: isDefaultName && newNum > 0 ? `Grade ${newNum}` : prev.name,
      };
    });
  }

  function handleSubmit() {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push("Grade name is required (e.g. 'Grade 10').");
    }

    if (!formData.number || formData.number < 1) {
      newErrors.push("Grade number must be a valid positive integer (e.g. 1 to 13).");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Saving grade:", formData);
    onOpenChange(false);
  }

  function handleDelete() {
    console.log("Deleting grade:", data?.id);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Grade" : "Add Grade"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <RenderDialogErrors errors={errors} />

            <FieldGroup className="space-y-3">
              <Field>
                <FieldLabel htmlFor="grade-number">Grade Number</FieldLabel>
                <Input
                  id="grade-number"
                  type="number"
                  min={1}
                  max={13}
                  placeholder="e.g. 10"
                  value={formData.number || ""}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  autoFocus
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="grade-name">Grade Name</FieldLabel>
                <Input
                  id="grade-name"
                  placeholder="e.g. Grade 10"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <div className="flex min-w-full items-center">
              {data && (
                <Button
                  variant="destructive"
                  size="icon"
                  title="Delete grade"
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
                  {isEditing ? "Save Changes" : "Create Grade"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={isDeleting}
        onOpenChange={setIsDeleting}
        title="Delete Grade"
        description="Are you sure you want to delete this grade? Deleting a grade will affect associated classes, curriculum plans, and student enrollments."
        itemIdentifier={data ? `${data.name} (Grade ${data.number})` : undefined}
        confirmationPhrase="Yes i wanted to delete"
        onConfirm={handleDelete}
      />
    </>
  );
}
