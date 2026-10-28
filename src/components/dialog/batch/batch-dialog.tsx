"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { IBatchListItem } from "@/features/batch";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { batchTypeOptions } from "@/features/batch/batch.enums";
import { Controller, useForm } from "react-hook-form";
import { batchSchema } from "@/features/batch/batch.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { createBatchAction, deleteBatchAction, updateBatchAction } from "@/features/batch/batch.action";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";

interface BatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Partial<IBatchListItem> | null;
}

export default function BatchDialog({ open, onOpenChange, data }: BatchDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof batchSchema>>({
    defaultValues: {
      name: data?.name ?? "",
      type: data?.type ?? "al",
    },
    resolver: zodResolver(batchSchema),
  });

  const isEditing = Boolean(data?.id);
  const isFormSubmitting = form.formState.isSubmitting;

  async function handleCreate(formData: z.infer<typeof batchSchema>) {
    const res = await createBatchAction(formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleUpdate(formData: z.infer<typeof batchSchema>) {
    if (!data?.id) return;
    const res = await updateBatchAction(data.id, formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleDelete() {
    if (!data?.id) return;
    const res = await deleteBatchAction(data.id);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={isFormSubmitting ? undefined : onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Batch" : "Add Batch"}</DialogTitle>
          </DialogHeader>

          <form id="batch-form" onSubmit={form.handleSubmit(isEditing ? handleUpdate : handleCreate)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="batch-name">Batch Name</FieldLabel>
                    <Input
                      {...field}
                      id="batch-name"
                      placeholder="e.g. 2026 A/L"
                      aria-invalid={fieldState.invalid}
                      disabled={isFormSubmitting}
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
                    <FieldLabel htmlFor="batch-type">Batch Type</FieldLabel>
                    <Select
                      id="batch-type"
                      items={batchTypeOptions}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      disabled={isFormSubmitting}
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
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <DialogFooter>
            <div className="flex min-w-full items-center">
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsDeleting(true)}
                  disabled={isFormSubmitting}
                >
                  <TrashIcon /> Delete batch
                </Button>
              )}
              <div className="flex flex-1 gap-3 justify-end">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isFormSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" form="batch-form" disabled={isFormSubmitting}>
                  {isEditing ? "Save Changes" : "Create Batch"}
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
          title={`Delete ${data.name} Batch`}
          description="Are you sure you want to delete this batch?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
