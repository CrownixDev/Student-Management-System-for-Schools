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
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isDefinedError } from "@orpc/client";
import { revalidateCache } from "@/lib/actions";
import { rpcTanStack } from "@/lib/orpc/client";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";

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
  const queryClient = useQueryClient();
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

  const createMutation = useMutation(
    rpcTanStack.academicYear.create.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({
          queryKey: rpcTanStack.academicYear.key(),
        });
        onOpenChange(false);
        toast.success("Academic year created");
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Unknown error occured");
        }
      },
    }),
  );

  const updateMutation = useMutation(
    rpcTanStack.academicYear.update.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({
          queryKey: rpcTanStack.academicYear.key(),
        });
        onOpenChange(false);
        toast.success("Academic year updated");
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Unknown error occured");
        }
      },
    }),
  );

  function handleSubmit(formData: z.infer<typeof academicYearSchema>) {
    if (isEditing && data && data.id) {
      updateMutation.mutate({ id: data.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const deleteMutation = useMutation(
    rpcTanStack.academicYear.delete.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({
          queryKey: rpcTanStack.academicYear.key(),
        });
        onOpenChange(false);
        toast.success("Academic year deleted");
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Unknown error occured");
        }
      },
    }),
  );

  return (
    <>
      <Dialog open={open} onOpenChange={form.formState.isSubmitting ? undefined : onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Academic Year" : "Add Academic Year"}</DialogTitle>
          </DialogHeader>

          <form id="year-data-form" className="py-2" onSubmit={form.handleSubmit(handleSubmit)}>
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
          onConfirm={() => (data?.id ? deleteMutation.mutate({ id: data.id }) : undefined)}
        />
      )}
    </>
  );
}
