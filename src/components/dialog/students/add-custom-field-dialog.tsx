"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import z from "zod";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { studentJsonFieldSchema } from "@/features/students/student.schema";
import { createStudentJsonFieldAction } from "@/features/students/students.actions";
import { StudentJsonFieldType } from "@/features/students";
import { STUDENT_CUSTOM_FIELDS } from "@/lib/query-keys";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormData = z.infer<typeof studentJsonFieldSchema>;

const fieldTypeOptions: { value: StudentJsonFieldType; label: string }[] = [
  { value: "text", label: "Normal Text" },
  { value: "bigText", label: "Long Text" },
  { value: "date", label: "Date" },
];

export default function AddCustomFieldDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(studentJsonFieldSchema),
    defaultValues: {
      name: "",
      type: "text",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await createStudentJsonFieldAction(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: async (res) => {
      toast.success(res.message);
      await queryClient.invalidateQueries({ queryKey: [STUDENT_CUSTOM_FIELDS] });
      form.reset({ name: "", type: "text" });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create custom field");
    },
  });

  function handleSubmit(data: FormData) {
    mutate(data);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset({ name: "", type: "text" });
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : handleOpenChange}>
      <DialogContent className="sm:max-w-md">
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
                    disabled={isPending}
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
                    disabled={isPending}
                  >
                    <SelectTrigger id="custom-field-type" className="w-full">
                      <SelectValue placeholder="Select a field type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
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

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="add-custom-field-form" disabled={isPending}>
            {isPending ? "Adding..." : "Add field"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
