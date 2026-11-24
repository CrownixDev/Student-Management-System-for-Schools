"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { IStudentJsonField, StudentJsonFieldType } from "@/features/students";
import { studentJsonFieldSchema } from "@/features/students/student.schema";
import { cn, StrictOmit } from "@/lib/utils";
import { Input } from "@/components/shadcn/input";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { rpcTanStack } from "@/lib/orpc/client";
import { revalidateCache } from "@/lib/actions";
import { isDefinedError } from "@orpc/client";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";

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

  const createMutation = useMutation(
    rpcTanStack.student.createJsonField.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.student.getJsonFields.key() });
        toast.success("Custom field created successfully");
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

  const updateMutation = useMutation(
    rpcTanStack.student.updateJsonField.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.student.getJsonFields.key() });
        toast.success("Custom field updated successfully");
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

  async function handleSubmit(formData: z.infer<typeof studentJsonFieldSchema>) {
    if (isEditing && data && data.id) {
      await updateMutation.mutateAsync({ id: data.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  }

  const deleteMutation = useMutation(
    rpcTanStack.student.deleteJsonField.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.student.getJsonFields.key() });
        toast.success("Custom field deleted successfully");
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

          <form id="add-custom-field-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
          onConfirm={() => (data && data.id ? deleteMutation.mutate({ id: data.id }) : undefined)}
        />
      )}
    </>
  );
}
