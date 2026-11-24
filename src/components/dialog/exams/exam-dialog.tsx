"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { IExamListItem } from "@/features/exams";
import { ISubjectListItem } from "@/features/subjects";
import { AlertTriangleIcon, BookPlusIcon, Trash2Icon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { getSubjectCategory } from "@/features/subjects/subject.enums";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examDialogSchema, examSchema } from "@/features/exams/exams.schema";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rpcTanStack } from "@/lib/orpc/client";
import { revalidateCache } from "@/lib/actions";
import { isDefinedError } from "@orpc/client";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import SubjectPickerDialog from "../subject-picker-dialog";
import TooltipButton from "@/components/ui/tooltip-button";
import z from "zod";

interface ExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade?: { id: string; name: string };
  data?: IExamListItem | null;
}

export default function ExamDialog({ open, onOpenChange, grade, data }: ExamDialogProps) {
  const queryClient = useQueryClient();
  const [isSelectSubjectsOpen, setIsSelectSubjectsOpen] = useState(false);
  const [isSubjectDeleting, setIsSubjectDeleting] = useState<{ open: boolean; index: number | null }>({
    open: false,
    index: null,
  });
  const [isDeletingExam, setIsDeletingExam] = useState(false);

  const form = useForm({
    defaultValues: {
      name: data?.name ?? "",
      examSubjects: data?.examSubjects ?? [],
    },
    resolver: zodResolver(examDialogSchema),
  });

  const {
    fields: examSubjects,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "examSubjects",
    keyName: "keyId",
  });

  const isSubmitting = form.formState.isSubmitting;
  const isEditing = Boolean(data?.id);

  function handleAddSubjects(chosen: ISubjectListItem[]) {
    const newItems: IExamListItem["examSubjects"][number][] = chosen
      .filter((c) => !form.getValues("examSubjects").some((es) => es.subject.id === c.id))
      .map((c) => ({
        id: "",
        maxMarks: 100,
        passMark: 35,
        ignoreRanking: false,
        subject: {
          id: c.id,
          name: c.name,
          code: c.code,
          category: c.category,
        },
      }));

    newItems.forEach((sub) => {
      append(sub);
    });
  }

  function handleCancelDeleteSubject() {
    setIsSubjectDeleting({ open: false, index: null });
  }

  function handleRequestDeleteSubject(index: number) {
    const isExistingSubject = Boolean(
      data?.examSubjects.find((s) => s.subject.id === form.getValues("examSubjects")[index].subject.id),
    );
    if (isEditing && isExistingSubject) {
      setIsSubjectDeleting({ open: true, index });
    } else {
      remove(index);
    }
  }

  const deleteSubjectMutation = useMutation(
    rpcTanStack.exam.deleteExamSubject.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/exams");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.exam.key() });
        toast.success("Subject deleted from exam");
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

  async function handleConfirmDeleteSubject() {
    if (isSubjectDeleting.index === null) return;
    await deleteSubjectMutation.mutateAsync({ id: examSubjects[isSubjectDeleting.index!].id });
    handleCancelDeleteSubject();
  }

  const createMutation = useMutation(
    rpcTanStack.exam.create.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/exams");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.exam.key() });
        toast.success("Exam Created");
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
    rpcTanStack.exam.update.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/exams");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.exam.key() });
        toast.success("Exam Updated");
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

  async function handleSubmit(formData: z.infer<typeof examSchema>) {
    if (!grade) return;
    if (isEditing && data && data.id) {
      await updateMutation.mutateAsync({ examId: data.id, data: formData });
    } else {
      await createMutation.mutateAsync({ gradeId: grade.id, data: formData });
    }
  }

  const deleteMutation = useMutation(
    rpcTanStack.exam.delete.mutationOptions({
      onSuccess: async () => {
        await revalidateCache("/exams");
        await queryClient.invalidateQueries({ queryKey: rpcTanStack.exam.key() });
        toast.success("Exam Deleted");
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
        <DialogContent className="max-h-[90vh] min-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Exam" : "Create Exam"}</DialogTitle>
          </DialogHeader>

          <form id="exam-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup className="min-w-0">
              <FieldSet className="min-w-0">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="exam-name">Exam Name</FieldLabel>
                      <Input
                        {...field}
                        id="exam-name"
                        placeholder="e.g. 1st Term Test"
                        aria-invalid={fieldState.invalid}
                        disabled={isSubmitting}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </FieldSet>

              <FieldSet className="min-w-0">
                <Field orientation="horizontal">
                  <FieldLabel>Exam Subjects</FieldLabel>
                  <Button variant="outline" onClick={() => setIsSelectSubjectsOpen(true)}>
                    <BookPlusIcon />
                    Add Subjects
                  </Button>
                </Field>
                <div className="min-w-0 max-w-full h-fit max-h-[min(20rem,40vh)] overflow-auto rounded-lg border bg-card">
                  <Table containerClassName="overflow-visible" className="min-w-max">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky top-0 z-10 w-50 bg-background">Subject</TableHead>
                        <TableHead className="sticky top-0 z-10 bg-background">Category</TableHead>
                        <TableHead className="sticky top-0 z-10 w-25 bg-background">Pass Mark</TableHead>
                        <TableHead className="sticky top-0 z-10 w-25 bg-background">Max Marks</TableHead>
                        <TableHead className="sticky top-0 z-10 w-25 bg-background">Ignore Ranking</TableHead>
                        <TableHead className="sticky top-0 z-10 w-15 bg-background text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {examSubjects.map((esub, index) => {
                        return (
                          <TableRow key={esub.keyId}>
                            <TableCell className="flex flex-col w-50">
                              <span className="truncate" title={esub.subject.name}>
                                {esub.subject.name}
                              </span>
                              {esub.subject.code && (
                                <span className="text-sm text-muted-foreground truncate">({esub.subject.code})</span>
                              )}
                            </TableCell>

                            <TableCell>
                              <span className="truncate">{getSubjectCategory(esub.subject.category)}</span>
                            </TableCell>

                            <TableCell>
                              <Controller
                                name={`examSubjects.${index}.passMark`}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <Input
                                      {...field}
                                      type="number"
                                      min={0}
                                      aria-invalid={fieldState.invalid}
                                      disabled={isSubmitting}
                                      onChange={(event) => {
                                        const val = event.target.value;
                                        field.onChange(val === "" ? "" : Number(val));
                                      }}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                  </Field>
                                )}
                              />
                            </TableCell>

                            <TableCell>
                              <Controller
                                name={`examSubjects.${index}.maxMarks`}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <Input
                                      {...field}
                                      type="number"
                                      min={0}
                                      aria-invalid={fieldState.invalid}
                                      disabled={isSubmitting}
                                      onChange={(event) => {
                                        const val = event.target.value;
                                        field.onChange(val === "" ? "" : Number(val));
                                      }}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                  </Field>
                                )}
                              />
                            </TableCell>
                            <TableCell className="flex justify-center items-center">
                              <Controller
                                name={`examSubjects.${index}.ignoreRanking`}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                  <Checkbox
                                    checked={Boolean(field.value)}
                                    onCheckedChange={(value) => field.onChange(value)}
                                    className={"cursor-pointer"}
                                    aria-invalid={fieldState.invalid}
                                  />
                                )}
                              />
                            </TableCell>

                            <TableCell className="py-2 text-right">
                              <TooltipButton
                                tooltip="Remove subject"
                                size="icon"
                                variant={(function () {
                                  const isExistingSubject = Boolean(
                                    data?.examSubjects.find(
                                      (s) => s.subject.id === form.getValues("examSubjects")[index].subject.id,
                                    ),
                                  );
                                  if (isEditing && isExistingSubject) {
                                    return "destructive";
                                  } else {
                                    return "ghost";
                                  }
                                })()}
                                onClick={() => handleRequestDeleteSubject(index)}
                              >
                                <Trash2Icon className="size-3.5" />
                              </TooltipButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {examSubjects.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-xs text-muted-foreground">
                            No subjects added yet. Click &ldquo;Add Subjects&rdquo; to select curriculum subjects for
                            this exam.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </FieldSet>
            </FieldGroup>
          </form>

          <DialogFooter>
            <div className="flex min-w-full items-center justify-between">
              {data && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => setIsDeletingExam(true)}
                  disabled={isSubmitting}
                >
                  <TrashIcon /> Delete Exam
                </Button>
              )}
              <div className="flex flex-1 gap-3 justify-end">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" form="exam-form" disabled={isSubmitting}>
                  {isEditing ? "Save Changes" : "Create Exam"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isSelectSubjectsOpen && (
        <SubjectPickerDialog
          open={isSelectSubjectsOpen}
          onOpenChange={setIsSelectSubjectsOpen}
          selectedSubjectIds={form.getValues("examSubjects").map((esub) => esub.subject.id)}
          onAdd={handleAddSubjects}
          title="Add subjects to exam"
        />
      )}

      {isSubjectDeleting.open && (
        <AlertDialog open={isSubjectDeleting.open}>
          <AlertDialogContent className="min-w-sm">
            <AlertDialogHeader>
              <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                <AlertTriangleIcon className="size-5" />
              </div>
              <AlertDialogTitle className="text-lg font-semibold">{`Remove '${examSubjects[isSubjectDeleting.index!].subject.name}'?`}</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this subject from this exam?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDeleteSubject}>Keep Subject</AlertDialogCancel>
              <AlertDialogAction variant={"destructive"} onClick={handleConfirmDeleteSubject}>
                Remove Subject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {data && (
        <DeleteConfirmationDialog
          open={isDeletingExam}
          onOpenChange={setIsDeletingExam}
          title={`Delete '${data.name}'`}
          description="Are you sure you want to delete this exam?"
          onConfirm={() => (data && data.id ? deleteMutation.mutate({ examId: data.id }) : undefined)}
        />
      )}
    </>
  );
}
