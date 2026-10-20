"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import RenderDialogErrors from "../compoennts/render-dialog-errors";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import { IMediumListItem } from "@/features/medium";

interface MediumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IMediumListItem | null;
}

export default function MediumDialog({ open, onOpenChange, data }: MediumDialogProps) {
  const isEditing = Boolean(data?.id);
  const [name, setName] = useState(data?.name ?? "");
  const [errors, setErrors] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleSubmit() {
    if (!name.trim()) {
      setErrors(["Medium name is required (e.g. 'Sinhala', 'English')."]);
      return;
    }
    console.log("Saving medium:", { id: data?.id, name: name.trim() });
    onOpenChange(false);
  }

  function handleDelete() {
    console.log("Deleting medium:", data?.id);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Medium" : "Add Medium"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <RenderDialogErrors errors={errors} />
            <FieldGroup className="space-y-3">
              <Field>
                <FieldLabel htmlFor="medium-name">Medium Name</FieldLabel>
                <Input
                  id="medium-name"
                  placeholder="e.g. Sinhala, English, Tamil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <div className="flex min-w-full items-center">
              {isEditing && (
                <Button
                  variant="destructive"
                  size="icon"
                  title="Delete medium"
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
                  {isEditing ? "Save Changes" : "Create Medium"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={isDeleting}
        onOpenChange={setIsDeleting}
        title="Delete Medium"
        description="Are you sure you want to delete this medium? This may affect classes and student enrollments that use this medium."
        itemIdentifier={data ? `Medium: ${data.name}` : undefined}
        confirmationPhrase="Yes i wanted to delete"
        onConfirm={handleDelete}
      />
    </>
  );
}
