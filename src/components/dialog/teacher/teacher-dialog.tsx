"use client";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { ITeacher } from "@/features/teachers";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { teacherSchema } from "@/features/teachers/teachers.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rpcTanStack } from "@/lib/orpc/client";
import { revalidateCache } from "@/lib/actions";
import { isDefinedError } from "@orpc/client";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";

export default function TeacherDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Pick<ITeacher, "id" | "fullName" | "phone" | "isActive">;
}) {
  const isEditing = Boolean(data?.id);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof teacherSchema>>({
    defaultValues: {
      fullName: data?.fullName ?? "",
      phone: data?.phone ?? "",
      isActive: data?.isActive ?? true,
    },
    resolver: zodResolver(teacherSchema),
  });

  const createMutation = useMutation(
    rpcTanStack.teacher.create.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.teacher.key() });
        toast.success("Teacher Created");
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
    rpcTanStack.teacher.update.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.teacher.key() });
        toast.success("Teacher Updated");
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

  async function handleSubmit(formData: z.infer<typeof teacherSchema>) {
    if (isEditing && data && data.id) {
      await updateMutation.mutateAsync({ id: data.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  }

  const deleteMutation = useMutation(
    rpcTanStack.teacher.delete.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.teacher.key() });
        router.replace("/setup/teachers");
        toast.success("Teacher Deleted");
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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{data ? "Edit teacher" : "Add teacher"}</DialogTitle>
          </DialogHeader>
          <form id="teacher-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="teacher-name">Full name</FieldLabel>
                    <Input
                      {...field}
                      id="teacher-name"
                      placeholder="Enter teacher's name"
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="teacher-phone">Phone</FieldLabel>
                    <Input
                      {...field}
                      id="teacher-phone"
                      type="tel"
                      placeholder="Enter teacher's phone number"
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="isActive"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <Checkbox
                      id="teacher-active"
                      checked={Boolean(field.value)}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                    />
                    <FieldLabel htmlFor="teacher-active">Active teacher</FieldLabel>
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
                  <TrashIcon /> Delete Teacher
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
                <Button type="submit" form="teacher-form" disabled={form.formState.isSubmitting}>
                  {data ? "Save changes" : "Add teacher"}
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
          title={`Delete '${data.fullName}'?`}
          description="Are you sure you want to delete this teacher?"
          onConfirm={() => (data && data.id ? deleteMutation.mutate({ id: data.id }) : undefined)}
        />
      )}
    </>
  );
}
