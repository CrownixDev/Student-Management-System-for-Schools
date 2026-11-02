import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { CircleQuestionMarkIcon, TrashIcon } from "lucide-react";
import { subjectCategories } from "@/features/subjects/subject.enums";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { ISubject } from "@/features/subjects";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { subjectSchema } from "@/features/subjects/subject.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubjectAction, deleteSubjectAction, updateSubjectAction } from "@/features/subjects/subject.actions";
import { toast } from "react-toastify";
import TooltipButton from "@/components/ui/tooltip-button";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";

export default function SubjectDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Partial<Pick<ISubject, "id" | "name" | "code" | "category">>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm<z.infer<typeof subjectSchema>>({
    defaultValues: {
      name: data?.name ?? "",
      category: data?.category ?? "core",
      code: data?.code ?? "",
    },
    resolver: zodResolver(subjectSchema),
  });
  const isEditing = Boolean(data?.id);
  const isSubmitting = form.formState.isSubmitting;

  async function handleCreate(formData: z.infer<typeof subjectSchema>) {
    const res = await createSubjectAction(formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleUpdate(formData: z.infer<typeof subjectSchema>) {
    if (!data?.id) return;
    const res = await updateSubjectAction(data.id, formData);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  async function handleDelete() {
    if (!data?.id) return;
    const res = await deleteSubjectAction(data.id);
    if (res.success) {
      onOpenChange(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{data ? "Edit subject" : "Add subject"}</DialogTitle>
          </DialogHeader>
          <form id="subject-form" onSubmit={form.handleSubmit(isEditing ? handleUpdate : handleCreate)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Subject name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Enter subject name"
                      disabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="code"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="code">Subject code</FieldLabel>
                      <Input
                        {...field}
                        id="code"
                        placeholder="E.g., ICT-AL"
                        disabled={isSubmitting}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        items={subjectCategories}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        disabled={isSubmitting}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {subjectCategories.map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {!isEditing && form.getValues("category") === "core" && (
                <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                  <CircleQuestionMarkIcon />
                  <AlertTitle>Core</AlertTitle>
                  <AlertDescription>
                    Core subjects are mandatory for all non A/L students. E.g: Sinhala, Science
                  </AlertDescription>
                </Alert>
              )}
            </FieldGroup>
          </form>

          <DialogFooter>
            <div className="flex min-w-full items-center">
              {(data?.name || data?.code) && (
                <TooltipButton
                  tooltip="Delete this subject"
                  variant="destructive"
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  disabled={isSubmitting}
                >
                  <TrashIcon /> Delete Subject
                </TooltipButton>
              )}
              <div className="flex flex-1 gap-3 justify-end">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" form="subject-form" disabled={isSubmitting}>
                  {data ? "Save changes" : "Add subject"}
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
          title={`Delete Subject '${data.name}'`}
          description="Are you sure you want to delete this subject?"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
