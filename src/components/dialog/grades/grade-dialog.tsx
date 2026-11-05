"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { useState } from "react";
import { IGradeListItem } from "@/features/grades";
import { TrashIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gradeSchema } from "@/features/grades/grades.schema";
import { createGradeAction, deleteGradeAction, updateGradeAction } from "@/features/grades/grades.actions";
import { toast } from "react-toastify";
import { IAcademicYear } from "@/features/academic-years";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";

export default function GradeDialog({
  open,
  onOpenChange,
  data,
  year,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Partial<IGradeListItem> | null;
  onSave?: Partial<IGradeListItem>;
  year?: IAcademicYear;
}) {
  const isEditing = Boolean(data?.id);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof gradeSchema>>({
    defaultValues: {
      name: data?.name ?? "Grade 1",
    },
    resolver: zodResolver(gradeSchema),
  });

  async function handleCreate(formData: z.infer<typeof gradeSchema>) {
    if (!year) return;
    const res = await createGradeAction(year.id, formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleUpdate(formData: z.infer<typeof gradeSchema>) {
    if (!data?.id) return;
    const res = await updateGradeAction(data.id, formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleDelete() {
    if (!data?.id) return;
    const res = await deleteGradeAction(data.id);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={form.formState.isSubmitting ? undefined : onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Grade" : "Add Grade"}</DialogTitle>
          </DialogHeader>

          <form id="grade-form" onSubmit={form.handleSubmit(isEditing ? handleUpdate : handleCreate)}>
            <FieldGroup className="space-y-3">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="grade-name">Grade Name</FieldLabel>
                    <Input
                      {...field}
                      id="grade-name"
                      placeholder="e.g. Grade 10"
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <DialogFooter>
            <div className="flex min-w-full items-center">
              {data && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  disabled={form.formState.isSubmitting}
                >
                  <TrashIcon />
                  Delete Grade
                </Button>
              )}
              <div className="flex flex-1 gap-3 justify-end">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" form="grade-form" disabled={form.formState.isSubmitting}>
                  {isEditing ? "Save Changes" : "Create Grade"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {data && (
        <DeleteConfirmationDialog
          open={isDeleting}
          onOpenChange={setIsDeleting}
          title={`Delete ${data.name}?`}
          description="Are you sure you want to delete this grade?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
