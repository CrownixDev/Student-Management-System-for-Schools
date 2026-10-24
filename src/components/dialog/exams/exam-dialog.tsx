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
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { IExamListItem, IExamSubject } from "@/features/exams";
import { ISubjectListItem } from "@/features/subjects";
import { AlertTriangleIcon, BookPlusIcon, Trash2Icon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { subjectCategories } from "@/features/subjects/subject.enums";
import RenderDialogErrors from "../compoennts/render-dialog-errors";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import SubjectPickerDialog from "../subject-picker-dialog";

export interface IExamDialogData {
  id?: string;
  name: string;
  academicYearId: string;
  gradeLevelId: string;
  examSubjects: Pick<IExamSubject, "id" | "passMark" | "maxMarks">[];
}

interface ExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYear: { id: string; name: string };
  gradeLevel: { id: string; name: string };
  initialData?: IExamListItem | null;
  onSave?: (data: IExamDialogData) => void;
  onDeleteExam?: (examId: string) => void;
}

function getExamSubjects(exam?: IExamListItem | null): IExamSubject[] {
  return exam?.examSubjects ?? [];
}

export default function ExamDialog({
  open,
  onOpenChange,
  academicYear,
  gradeLevel,
  initialData,
  onSave,
  onDeleteExam,
}: ExamDialogProps) {
  const isEditing = Boolean(initialData?.id);
  const [name, setName] = useState(initialData?.name ?? "");
  const [subjects, setSubjects] = useState<IExamSubject[]>(() => getExamSubjects(initialData));
  const [errors, setErrors] = useState<string[]>([]);
  const [isSelectSubjectsOpen, setIsSelectSubjectsOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<IExamSubject | null>(null);
  const [isDeletingExam, setIsDeletingExam] = useState(false);
  const [dialogSession, setDialogSession] = useState({ open, initialData });

  if (dialogSession.open !== open || (open && dialogSession.initialData !== initialData)) {
    setDialogSession({ open, initialData });
    if (open) {
      setName(initialData?.name ?? "");
      setSubjects(getExamSubjects(initialData));
      setErrors([]);
      setIsSelectSubjectsOpen(false);
      setSubjectToDelete(null);
      setIsDeletingExam(false);
    }
  }

  function handleAddSubjects(chosen: ISubjectListItem[]) {
    const newItems: IExamSubject[] = chosen
      .filter((c) => !subjects.some((s) => s.id === c.id))
      .map((c) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        category: c.category,
        maxMarks: 100,
        passMark: 35,
      }));

    setSubjects((prev) => [...prev, ...newItems]);
  }

  function handleUpdateSubject(subjectId: string, updates: Partial<IExamSubject>) {
    setSubjects((prev) => prev.map((s) => (s.id === subjectId ? { ...s, ...updates } : s)));
  }

  function handleRequestDeleteSubject(subject: IExamSubject) {
    if (isEditing) {
      setSubjectToDelete(subject);
    } else {
      setSubjects((prev) => prev.filter((s) => s.id !== subject.id));
    }
  }

  function handleConfirmDeleteSubject() {
    if (!subjectToDelete) return;
    setSubjects((prev) => prev.filter((s) => s.id !== subjectToDelete.id));
    setSubjectToDelete(null);
  }

  function handleSubmit() {
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push("Exam name is required (e.g. '1st Term Test').");
    }

    if (subjects.length === 0) {
      newErrors.push("At least one subject must be added to the exam.");
    }

    for (const sub of subjects) {
      if (Number(sub.maxMarks) <= 0) {
        newErrors.push(`Max marks for ${sub.name} must be greater than 0.`);
      }
      if (Number(sub.passMark) < 0 || Number(sub.passMark) > Number(sub.maxMarks)) {
        newErrors.push(`Pass mark for ${sub.name} must be between 0 and max marks (${sub.maxMarks}).`);
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: IExamDialogData = {
      id: initialData?.id,
      name: name.trim(),
      academicYearId: academicYear.id,
      gradeLevelId: gradeLevel.id,
      examSubjects: subjects.map((subject) => ({
        id: subject.id,
        maxMarks: Number(subject.maxMarks),
        passMark: Number(subject.passMark),
      })),
    };

    if (onSave) {
      onSave(payload);
    }

    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Exam" : "Create Exam"}</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <FieldSet>
              <RenderDialogErrors errors={errors} />
              <Field>
                <FieldLabel htmlFor="exam-name">Exam Name</FieldLabel>
                <Input
                  id="exam-name"
                  placeholder="e.g. 1st Term Test"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </Field>
            </FieldSet>

            <FieldSet>
              <Field orientation="horizontal">
                <FieldLabel>Exam Subjects</FieldLabel>
                <Button variant="outline" onClick={() => setIsSelectSubjectsOpen(true)}>
                  <BookPlusIcon />
                  Add Subjects
                </Button>
              </Field>
              <div className="h-fit max-h-[min(20rem,40vh)] overflow-auto rounded-lg border bg-card">
                <Table containerClassName="overflow-visible">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 z-10 w-50 bg-background">Subject</TableHead>
                      <TableHead className="sticky top-0 z-10 bg-background">Category</TableHead>
                      <TableHead className="sticky top-0 z-10 w-25 bg-background">Pass Mark</TableHead>
                      <TableHead className="sticky top-0 z-10 w-25 bg-background">Max Marks</TableHead>
                      <TableHead className="sticky top-0 z-10 w-15 bg-background text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((sub) => {
                      const category = subjectCategories.find((cat) => cat.value === sub.category);
                      return (
                        <TableRow key={sub.id}>
                          <TableCell className="flex gap-2">
                            <span className="truncate">{sub.name}</span>
                            {sub.code && <span className="text-muted-foreground">({sub.code})</span>}
                          </TableCell>

                          <TableCell className="">
                            <span className="truncate">{category?.label ?? "Other"}</span>
                          </TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              max={sub.maxMarks}
                              value={sub.passMark}
                              onChange={(e) =>
                                handleUpdateSubject(sub.id, {
                                  passMark: Number(e.target.value),
                                })
                              }
                              className="h-7 text-xs font-mono"
                            />
                          </TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              value={sub.maxMarks}
                              onChange={(e) =>
                                handleUpdateSubject(sub.id, {
                                  maxMarks: Number(e.target.value),
                                })
                              }
                              className="h-7 text-xs font-mono"
                            />
                          </TableCell>

                          <TableCell className="py-2 text-right">
                            <Button
                              type="button"
                              size="icon-xs"
                              variant="ghost"
                              className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="Remove subject"
                              onClick={() => handleRequestDeleteSubject(sub)}
                            >
                              <Trash2Icon className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {subjects.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-xs text-muted-foreground">
                          No subjects added yet. Click &ldquo;Add Subjects&rdquo; to select curriculum subjects for this
                          exam.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </FieldSet>
          </FieldGroup>

          <DialogFooter>
            <div className="flex min-w-full items-center justify-between">
              {initialData && (
                <Button
                  variant="destructive"
                  size="icon"
                  title="Delete exam"
                  type="button"
                  onClick={() => setIsDeletingExam(true)}
                >
                  <TrashIcon />
                </Button>
              )}
              <div className="flex flex-1 gap-3 justify-end">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit}>
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
          selectedSubjectIds={subjects.map((subject) => subject.id)}
          onAdd={handleAddSubjects}
          title="Add subjects to exam"
        />
      )}

      <AlertDialog open={Boolean(subjectToDelete)} onOpenChange={(isOpen) => !isOpen && setSubjectToDelete(null)}>
        <AlertDialogContent className="max-w-md gap-4">
          <AlertDialogHeader className="gap-2 text-left">
            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
              <AlertTriangleIcon className="size-5" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold">Remove Subject from Exam?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Are you sure you want to remove &ldquo;{subjectToDelete?.name}&rdquo; from this exam? Deleting this will
              fail if there are any student marks recorded for this subject in this exam.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel onClick={() => setSubjectToDelete(null)}>Keep Subject</AlertDialogCancel>
            <AlertDialogAction variant={"destructive"} onClick={handleConfirmDeleteSubject}>
              Remove Subject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DeleteConfirmationDialog
        open={isDeletingExam}
        onOpenChange={setIsDeletingExam}
        title="Delete Exam"
        description="Are you sure you want to delete this exam? Deleting an exam permanently clears all student marks and results recorded for it."
        itemIdentifier={initialData ? initialData.name : undefined}
        confirmationPhrase="Yes i wanted to delete"
        onConfirm={() => {
          if (initialData?.id && onDeleteExam) {
            onDeleteExam(initialData.id);
          }
          onOpenChange(false);
        }}
      />
    </>
  );
}
