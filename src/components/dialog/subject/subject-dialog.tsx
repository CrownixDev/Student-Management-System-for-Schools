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
import { toast } from "react-toastify";
import TooltipButton from "@/components/ui/tooltip-button";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rpcTanStack } from "@/lib/orpc/client";
import { revalidateCache } from "@/lib/actions";
import { isDefinedError } from "@orpc/client";

export default function SubjectDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Partial<Pick<ISubject, "id" | "name" | "code" | "category">>;
}) {
  const queryClient = useQueryClient();
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

  const createMutation = useMutation(
    rpcTanStack.subject.create.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.subject.key() });
        toast.success("Subject Created");
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
    rpcTanStack.subject.update.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.subject.key() });
        toast.success("Subject Updated");
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

  async function handleSubmit(formData: z.infer<typeof subjectSchema>) {
    if (isEditing && data && data.id) {
      await updateMutation.mutateAsync({ id: data.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  }

  const deleteMutation = useMutation(
    rpcTanStack.subject.delete.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/setup");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.subject.key() });
        toast.success("Subject Deleted");
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
      <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{data ? "Edit subject" : "Add subject"}</DialogTitle>
          </DialogHeader>
          <form id="subject-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
          onConfirm={() => (data && data.id ? deleteMutation.mutate({ id: data.id }) : undefined)}
        />
      )}
    </>
  );
}
