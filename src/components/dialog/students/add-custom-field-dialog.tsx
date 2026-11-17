"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import {
  createStudentJsonFieldAction,
  deleteFieldAction,
  updateStudentJsonFieldAction,
} from "@/features/students/students.actions";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { IStudentJsonField, StudentJsonFieldType } from "@/features/students";
import { studentJsonFieldSchema } from "@/features/students/student.schema";
import { STUDENT_CUSTOM_FIELDS } from "@/lib/query-keys";
import { cn, StrictOmit } from "@/lib/utils";
import { Input } from "@/components/shadcn/input";
import z from "zod";
import { TrashIcon } from "lucide-react";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: StrictOmit<IStudentJsonField, "createdAt" | "updatedAt">;
}

type FormData = z.infer<typeof studentJsonFieldSchema>;

export default function AddCustomFieldDialog({ open, onOpenChange, data }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const isEditing = Boolean(data?.id);

  const form = useForm<FormData>({
    defaultValues: {
      name: data?.name ?? "",
      type: data?.type ?? "text",
    },
    resolver: zodResolver(studentJsonFieldSchema),
  });

  async function handleCreate(formData: z.infer<typeof studentJsonFieldSchema>) {
    const parsedRes = studentJsonFieldSchema.safeParse(formData);
    if (!parsedRes.success) {
      toast.error("Invalid data provided");
      return;
    }

    const res = await createStudentJsonFieldAction(parsedRes.data);
    if (res.success) {
      await queryClient.invalidateQueries({ queryKey: [STUDENT_CUSTOM_FIELDS] });
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleUpdate(formData: z.infer<typeof studentJsonFieldSchema>) {
    if (!data?.id) return;

    const parsedRes = studentJsonFieldSchema.safeParse(formData);
    if (!parsedRes.success) {
      toast.error("Invalid data provided");
      return;
    }

    const res = await updateStudentJsonFieldAction(data.id, parsedRes.data);
    if (res.success) {
      await queryClient.invalidateQueries({ queryKey: [STUDENT_CUSTOM_FIELDS] });
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleDelete() {
    if (!data?.id) return;
    const res = await deleteFieldAction(data.id);
    if (res.success) {
      await queryClient.invalidateQueries({ queryKey: [STUDENT_CUSTOM_FIELDS] });
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset({ name: "", type: "text" });
    }
    onOpenChange(nextOpen);
  }

  const fieldTypeOptions: { value: StudentJsonFieldType; label: string; disabled?: boolean }[] = [
    { value: "text", label: "Normal Text", disabled: data && data.type === "date" },
    { value: "bigText", label: "Long Text", disabled: data && data.type === "date" },
    { value: "date", label: "Date", disabled: data && (data.type === "text" || data.type === "bigText") },
  ];

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <Dialog open={open} onOpenChange={isSubmitting ? undefined : handleOpenChange}>
        <DialogContent className="min-w-md">
          <DialogHeader>
            <DialogTitle>Add custom field</DialogTitle>
            <DialogDescription>Create a new custom field to capture additional student details.</DialogDescription>
          </DialogHeader>

          <form id="add-custom-field-form" onSubmit={form.handleSubmit(isEditing ? handleUpdate : handleCreate)}>
            <FieldGroup className="space-y-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="custom-field-name">Field name</FieldLabel>
                    <Input
                      {...field}
                      id="custom-field-name"
                      placeholder="e.g. Old School, Admission date."
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                      autoFocus
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="custom-field-type">Field type</FieldLabel>
                    <Select
                      items={fieldTypeOptions}
                      value={field.value}
                      onValueChange={(val) => field.onChange(val as StudentJsonFieldType)}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="custom-field-type" className="w-full">
                        <SelectValue placeholder="Select a field type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypeOptions.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            disabled={opt.disabled}
                            className={cn("pointer-events-auto!", opt.disabled && "hover:cursor-not-allowed!")}
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <DialogFooter className="gap-2">
            <div className="flex min-w-full items-center">
              {isEditing && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  disabled={form.formState.isSubmitting}
                >
                  <TrashIcon /> Delete Field
                </Button>
              )}
              <div className="flex flex-1 gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" form="add-custom-field-form" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add field"}
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
          title={`Delete ${data.name} Field`}
          description="Are you sure you want to delete this field from student form?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
