"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { IMediumListItem } from "@/features/medium";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mediumSchema } from "@/features/medium/medium.schema";
import { createMediumAction, deleteMediumAction, updateMediumAction } from "@/features/medium/medium.actions";
import { toast } from "react-toastify";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";

interface MediumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IMediumListItem | null;
}

export default function MediumDialog({ open, onOpenChange, data }: MediumDialogProps) {
  const isEditing = Boolean(data?.id);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: data?.name ?? "",
    },
    resolver: zodResolver(mediumSchema),
  });

  async function handleCreate(formData: z.infer<typeof mediumSchema>) {
    const res = await createMediumAction(formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleUpdate(formData: z.infer<typeof mediumSchema>) {
    if (!data?.id) return;
    const res = await updateMediumAction(data.id, formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleDelete() {
    if (!data?.id) return;
    const res = await deleteMediumAction(data.id);
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
            <DialogTitle>{isEditing ? "Edit Medium" : "Add Medium"}</DialogTitle>
          </DialogHeader>

          <form id="medium-form" onSubmit={form.handleSubmit(isEditing ? handleUpdate : handleCreate)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="medium-name">Medium Name</FieldLabel>
                    <Input
                      {...field}
                      id="medium-name"
                      placeholder="e.g. Sinhala, English, Tamil"
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
              {isEditing && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  disabled={form.formState.isSubmitting}
                >
                  <TrashIcon /> Delete Medium
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
                <Button type="submit" form="medium-form" disabled={form.formState.isSubmitting}>
                  {isEditing ? "Save Changes" : "Create Medium"}
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
          title={`Delete ${data.name} Medium`}
          description="Are you sure you want to delete this medium?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
