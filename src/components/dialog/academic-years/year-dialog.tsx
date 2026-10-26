"use client";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { useState } from "react";
import { IAcademicYear } from "@/features/academic-years";
import { getHtmlDateString, StrictOmit } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
import RenderDialogErrors from "@/components/ui/dialog/render-dialog-errors";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";

export default function AcademicYearDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Partial<IAcademicYear> | null;
  onSave?: Partial<IAcademicYear>;
}) {
  const isEditing = Boolean(data?.id);
  const [formData, setFormData] = useState<StrictOmit<IAcademicYear, "id">>({
    name: data?.name ?? "",
    startDate: data?.startDate ?? new Date(),
    endDate: data?.endDate ?? new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    isCurrent: data?.isCurrent ?? false,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleSubmit() {
    console.log(formData);
    setErrors(["Hello Princess"]);
  }

  function handleDelete() {
    console.log("Deleting", data?.id);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Academic Year" : "Add Academic Year"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <RenderDialogErrors errors={errors} />

            <FieldGroup className="space-y-3">
              <Field>
                <FieldLabel htmlFor="year-name">Year Name</FieldLabel>
                <Input
                  id="year-name"
                  placeholder="e.g. 2026"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  autoFocus
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="start-date">Start Date</FieldLabel>
                  <Input
                    id="start-date"
                    type="date"
                    value={getHtmlDateString(formData.startDate)}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: new Date(e.target.value) }))}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="end-date">End Date</FieldLabel>
                  <Input
                    id="end-date"
                    type="date"
                    value={getHtmlDateString(formData.endDate)}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: new Date(e.target.value) }))}
                  />
                </Field>
              </div>

              <Field orientation="horizontal">
                <Checkbox
                  id="is-current"
                  checked={formData.isCurrent}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isCurrent: Boolean(checked) }))}
                />
                <FieldLabel htmlFor="is-current" className="font-normal">
                  Set as Current Academic Year
                </FieldLabel>
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <div className="flex min-w-full items-center">
              {data && (
                <Button
                  variant="destructive"
                  size="icon"
                  title="Delete academic year"
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
                  {isEditing ? "Save Changes" : "Create Academic Year"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={isDeleting}
        onOpenChange={setIsDeleting}
        title="Delete Academic Year"
        description="Are you sure you want to delete this academic year?"
        itemIdentifier={data ? `Academic Year ${data.name}` : undefined}
        confirmationPhrase="Yes i wanted to delete"
        onConfirm={handleDelete}
      />
    </>
  );
}
