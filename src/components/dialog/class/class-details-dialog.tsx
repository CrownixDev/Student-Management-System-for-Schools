"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { IClass } from "@/features/class";
import { PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classDetailsDialogSchema, classDetailsSchema } from "@/features/class/class.schema";
import { createClassAction, deleteClassAction, updateClassmAction } from "@/features/class/class.actions";
import { useRouter } from "next/navigation";
import TeacherPickerDialog from "@/components/dialog/teacher-picker-dialog";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";

export default function ClassDetailsDialog({
  open,
  onOpenChange,
  data,
  grade,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IClass;
  grade: IClass["gradeLevel"];
}) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: data?.name ?? "",
      teacher: data?.teacher ?? null,
    },
    resolver: zodResolver(classDetailsDialogSchema),
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [changingTeacher, setChangingTeacher] = useState(false);

  const isEditing = Boolean(data?.id);
  const isSubmitting = form.formState.isSubmitting;

  async function handleCreate(formData: z.infer<typeof classDetailsDialogSchema>) {
    const parsedRes = classDetailsSchema.safeParse({ ...formData, teacherId: formData.teacher?.id ?? null });
    if (!parsedRes.success) {
      toast.error("Invalid data provided");
      return;
    }

    const res = await createClassAction(grade.id, parsedRes.data);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleUpdate(formData: z.infer<typeof classDetailsDialogSchema>) {
    if (!data?.id) return;
    const parsedRes = classDetailsSchema.safeParse({ ...formData, teacherId: formData.teacher?.id ?? null });
    if (!parsedRes.success) {
      toast.error("Invalid data provided");
      return;
    }

    const res = await updateClassmAction(data.id, parsedRes.data);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleDelete() {
    if (!data?.id) return;
    const res = await deleteClassAction(data.id);
    if (res.success) {
      onOpenChange(false);
      router.replace("/setup/classes");
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto min-w-md">
          <DialogHeader>
            <DialogTitle>{data ? `Edit class: ${data.name}` : "Create class"}</DialogTitle>
          </DialogHeader>

          <form id="class-form" onSubmit={form.handleSubmit(isEditing ? handleUpdate : handleCreate)}>
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Academic year</FieldLabel>
                  <Input value={grade.academicYear.name} disabled />
                </Field>

                <Field>
                  <FieldLabel>Grade</FieldLabel>
                  <Input value={grade.name} disabled />
                </Field>
              </div>

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="class-name">Class name</FieldLabel>
                    <Input
                      {...field}
                      id="class-name"
                      placeholder="e.g. 10-D"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Field>
                <FieldLabel>Class teacher (optional)</FieldLabel>
                <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {form.getValues("teacher.fullName") ?? "No teacher selected"}
                  </span>
                  {form.getValues("teacher") && (
                    <Button size="sm" variant="ghost" onClick={() => form.setValues({ teacher: null })}>
                      <XIcon />
                      Remove
                    </Button>
                  )}
                  <Button type="button" size="sm" variant="outline" onClick={() => setChangingTeacher(true)}>
                    <PencilIcon />
                    Change
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </form>

          <DialogFooter>
            {data && (
              <Button
                type="button"
                variant="destructive"
                className="mr-auto"
                onClick={() => setIsDeleting(true)}
                disabled={isSubmitting}
              >
                <TrashIcon />
                Delete class
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" form="class-form" disabled={isSubmitting}>
              {data ? "Save changes" : "Create class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {changingTeacher && (
        <TeacherPickerDialog
          open
          onOpenChange={setChangingTeacher}
          selectedTeacherId={form.getValues("teacher.id")}
          onSelect={(teacher) => form.setValue("teacher", teacher)}
        />
      )}

      {data && (
        <DeleteConfirmationDialog
          open={isDeleting}
          onOpenChange={setIsDeleting}
          title={`Delete '${data.name}' Class`}
          description="Are you sure you want to delete this class?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
