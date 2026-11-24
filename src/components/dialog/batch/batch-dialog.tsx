"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { IBatchListItem } from "@/features/batch";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { batchTypeOptions } from "@/features/batch/batch.enums";
import { Controller, useForm } from "react-hook-form";
import { batchSchema } from "@/features/batch/batch.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rpcTanStack } from "@/lib/orpc/client";
import { revalidateCache } from "@/lib/actions";
import { isDefinedError } from "@orpc/client";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";

interface BatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Partial<IBatchListItem> | null;
}

export default function BatchDialog({ open, onOpenChange, data }: BatchDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof batchSchema>>({
    defaultValues: {
      name: data?.name ?? "",
      type: data?.type ?? "al",
    },
    resolver: zodResolver(batchSchema),
  });

  const isEditing = Boolean(data?.id);
  const isFormSubmitting = form.formState.isSubmitting;

  const createMutation = useMutation(
    rpcTanStack.batch.create.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.batch.key() });
        toast.success("Batch Created");
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
    rpcTanStack.batch.update.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.batch.key() });
        toast.success("Batch Updated");
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

  async function handleSubmit(formData: z.infer<typeof batchSchema>) {
    if (isEditing && data && data.id) {
      await updateMutation.mutateAsync({ id: data.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  }

  const deleteMutation = useMutation(
    rpcTanStack.batch.delete.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.batch.key() });
        toast.success("Batch Deleted");
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

  return (
    <>
      <Dialog open={open} onOpenChange={isFormSubmitting ? undefined : onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Batch" : "Add Batch"}</DialogTitle>
          </DialogHeader>

          <form id="batch-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
                  {isFormSubmitting && <Loader2Icon className="animate-spin" />}
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
          onConfirm={() => (data && data.id ? deleteMutation.mutate({ id: data.id }) : undefined)}
        />
      )}
    </>
  );
}
