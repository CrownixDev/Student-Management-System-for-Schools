"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { useState } from "react";
import { IAcademicYear } from "@/features/academic-years";
import { getHtmlDateString } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { academicYearSchema } from "@/features/academic-years/year.schema";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";
import {
  createAcademicYearAction,
  deleteAcademicYearAction,
  updateAcademicYearAction,
} from "@/features/academic-years/year.actions";
import { toast } from "react-toastify";

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
  const form = useForm<z.infer<typeof academicYearSchema>>({
    defaultValues: {
      name: data?.name ?? "",
      startDate: getHtmlDateString(data?.startDate ?? new Date()),
      endDate: getHtmlDateString(data?.endDate ?? new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
    },
    resolver: zodResolver(academicYearSchema),
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = Boolean(data?.id);

  async function handleCreate(formData: z.infer<typeof academicYearSchema>) {
    const res = await createAcademicYearAction(formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleUpdate(formData: z.infer<typeof academicYearSchema>) {
    if (!data?.id) return;
    const res = await updateAcademicYearAction(data.id, formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleDelete() {
    if (!data?.id) return;
    const res = await deleteAcademicYearAction(data.id);
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
            <DialogTitle>{isEditing ? "Edit Academic Year" : "Add Academic Year"}</DialogTitle>
          </DialogHeader>

          <form
            id="year-data-form"
            className="py-2"
            onSubmit={form.handleSubmit(isEditing ? handleUpdate : handleCreate)}
          >
            <FieldGroup className="space-y-3">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Year</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="e.g. 2026"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                      <Input
                        {...field}
                        id="startDate"
                        type="date"
                        aria-invalid={fieldState.invalid}
                        disabled={form.formState.isSubmitting}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="endDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                      <Input
                        {...field}
                        id="endDate"
                        type="date"
                        aria-invalid={fieldState.invalid}
                        disabled={form.formState.isSubmitting}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </form>

          <DialogFooter>
            <div className="flex min-w-full items-center">
              {data && (
                <Button
                  variant="destructive"
                  title="Delete academic year"
                  onClick={() => setIsDeleting(true)}
                  disabled={form.formState.isSubmitting}
                >
                  <TrashIcon /> Delete Year
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
                <Button type="submit" form="year-data-form" disabled={form.formState.isSubmitting}>
                  {isEditing ? "Save Changes" : "Create Academic Year"}
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
          description="Are you sure you want to delete this academic year?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
