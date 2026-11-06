"use client";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { IClass } from "@/features/class";
import { getMediumOptionsAction } from "@/features/medium/medium.actions";
import { MEDIUM_OPTIONS } from "@/lib/query-keys";
import { getStudentListForClassWithSubjectsAction } from "@/features/students/students.actions";
import { IStudentsListItem, IStudentsListWithSubjectsItem } from "@/features/students";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, Trash2Icon, UserPlusIcon, UsersIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import StudentPickerDialog, { SelectedStudent } from "@/components/dialog/student-picker-dialog";
import EmptyState from "@/components/ui/empty-state";
import LoadingIndicator from "@/components/ui/loading-indicator";
import {
  createEnrollmentsAction,
  deleteEnrollmentAction,
  updateStudentIndexAction,
  updateStudentSubjectEnrollmentAction,
  updateSubjectMediumAction,
} from "@/features/enrollment/enrollment.actions";
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
import TooltipButton from "@/components/ui/tooltip-button";

type SubjectColumnState = Record<string, boolean>;
type StudentSubjectState = Record<string, Record<string, boolean>>;
type StudentMediumState = Record<string, Record<string, string>>;
type ClassStudent = IStudentsListItem & {
  enrollment?: IStudentsListWithSubjectsItem["enrollment"];
};

export default function ClassStudentDialog({
  open,
  onOpenChange,
  classData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: IClass;
  onRemoveStudent?: (studentId: string) => void;
}) {
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [addedStudents, setAddedStudents] = useState<ClassStudent[]>([]);
  const [removedStudentIds, setRemovedStudentIds] = useState<string[]>([]);
  const [classIndexes, setClassIndexes] = useState<Record<string, string>>({});
  const [disabledSubjectColumns, setDisabledSubjectColumns] = useState<SubjectColumnState>(() =>
    Object.fromEntries(classData.subjects.map((subject) => [subject.id, false])),
  );
  const [studentSubjectState, setStudentSubjectState] = useState<StudentSubjectState>({});
  const [studentMediumState, setStudentMediumState] = useState<StudentMediumState>({});
  const [isStudentDeleting, setIsStudentDeleting] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const indexInputRef = useRef<(HTMLInputElement | null)[]>([]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    console.log(e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = indexInputRef.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  };

  const { data: enrolledStudents = [], isPending } = useQuery({
    enabled: open,
    queryFn: async () => {
      const result = await getStudentListForClassWithSubjectsAction(classData.id);
      if (!result.success) {
        toast.error(result.message);
        throw new Error(result.message);
      }
      return result.data;
    },
    queryKey: ["class-students", classData.gradeLevel.id, classData.id],
  });

  const { data: mediumOptions = [], isPending: isMediumPending } = useQuery({
    enabled: open,
    queryFn: async () => {
      const result = await getMediumOptionsAction();
      if (!result.success) {
        toast.error(result.message);
        throw new Error(result.message);
      }
      return result.data;
    },
    queryKey: [MEDIUM_OPTIONS],
  });

  const studentsById = new Map<string, ClassStudent>();
  for (const student of enrolledStudents) {
    if (!removedStudentIds.includes(student.id)) studentsById.set(student.id, student);
  }
  for (const student of addedStudents) {
    if (!removedStudentIds.includes(student.id)) studentsById.set(student.id, student);
  }
  const students = Array.from(studentsById.values());

  async function addStudents(selectedStudents: SelectedStudent[]) {
    const existingIds = new Set(students.map((student) => student.id));
    const newSelections = selectedStudents.filter(({ student }) => !existingIds.has(student.id));
    if (newSelections.length === 0) return;

    let nextIndex = Math.max(
      students.length,
      ...students.map((student, index) => Number(getClassIndex(student, index)) || index + 1),
      ...newSelections.map(({ previousClassIndex }) => previousClassIndex ?? 0),
    );
    const newStudents: ClassStudent[] = [];
    const nextIndexes: Record<string, string> = {};
    for (const { student, previousClassIndex } of newSelections) {
      newStudents.push(student);
      if (previousClassIndex !== undefined) {
        nextIndexes[student.id] = String(previousClassIndex);
      } else {
        nextIndexes[student.id] = String(++nextIndex);
      }
    }

    const subjects = classData.subjects.map((subject) => ({
      subjectId: subject.id,
      mediumId: subject.medium.id,
    }));
    const studentsData = newStudents.map((st, index) => ({ studentId: st.id, subjects, classIndex: index + 1 }));

    const res = await createEnrollmentsAction(classData.id, studentsData);

    if (res.success) {
      setRemovedStudentIds((current) => current.filter((id) => !newStudents.some((student) => student.id === id)));
      setClassIndexes((current) => ({ ...current, ...nextIndexes }));
      setAddedStudents((current) => {
        const knownIds = new Set(current.map((student) => student.id));
        return [...current, ...newStudents.filter((student) => !knownIds.has(student.id))];
      });
      setStudentSubjectState((current) => {
        const next = { ...current };
        for (const student of newStudents) {
          next[student.id] = Object.fromEntries(classData.subjects.map((subject) => [subject.id, true]));
        }
        return next;
      });
      setStudentMediumState((current) => {
        const next = { ...current };
        for (const student of newStudents) {
          next[student.id] = Object.fromEntries(classData.subjects.map((subject) => [subject.id, subject.medium.id]));
        }
        return next;
      });
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  function getStudent(studentId: string) {
    return students.find((student) => student.id === studentId);
  }

  function getClassIndex(student: ClassStudent, fallbackIndex: number) {
    return classIndexes[student.id] ?? student.enrollment?.classIndex?.toString() ?? String(fallbackIndex + 1);
  }

  function isEnrolledInSubject(studentId: string, subjectId: string) {
    const state = studentSubjectState[studentId];
    if (state && subjectId in state) return state[subjectId];

    const student = getStudent(studentId);
    return student?.enrollment?.subjects.some((subject) => subject.subjectId === subjectId) ?? true;
  }

  function getStudentMedium(studentId: string, subjectId: string) {
    const state = studentMediumState[studentId];
    if (state && subjectId in state) return state[subjectId] || null;

    return (
      getStudent(studentId)?.enrollment?.subjects.find((subject) => subject.subjectId === subjectId)?.mediumId ?? null
    );
  }

  async function toggleStudentSubject(
    studentId: string,
    subjectId: string,
    enrolled: boolean,
    columnAlreadyDisabled = false,
  ) {
    if (!columnAlreadyDisabled) {
      setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: true }));
    }
    try {
      const res = await updateStudentSubjectEnrollmentAction(classData.id, studentId, {
        subjectId,
        enrolled,
      });

      if (res.success) {
        setStudentSubjectState((current) => ({
          ...current,
          [studentId]: { ...current[studentId], [subjectId]: enrolled },
        }));
      } else {
        toast.error(res.message);
      }
    } finally {
      if (!columnAlreadyDisabled) {
        setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: false }));
      }
    }
  }

  async function toggleAllForSubject(subjectId: string) {
    const nextValue = !students.every((student) => isEnrolledInSubject(student.id, subjectId));
    const studentsToUpdate = students.filter((student) => isEnrolledInSubject(student.id, subjectId) !== nextValue);

    if (studentsToUpdate.length === 0) return;

    setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: true }));
    try {
      for (const student of studentsToUpdate) {
        await toggleStudentSubject(student.id, subjectId, nextValue, true);
      }
    } finally {
      setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: false }));
    }
  }

  async function changeStudentMedium(studentId: string, subjectId: string, mediumId: string | null) {
    if (!mediumId) {
      toast.error("A medium is required");
      return;
    }
    setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: true }));
    try {
      const res = await updateSubjectMediumAction(classData.id, studentId, { subjectId, mediumId });
      if (res.success) {
        setStudentMediumState((current) => ({
          ...current,
          [studentId]: { ...current[studentId], [subjectId]: mediumId ?? "" },
        }));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } finally {
      setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: false }));
    }
  }

  async function changeStudentClassIndex(studentId: string, classIndex: string) {
    if (typeof classIndex === "string" && classIndex !== "") {
      try {
        await updateStudentIndexAction(classData.id, studentId, {
          classIndex: Number.parseInt(classIndex),
        });
      } catch {
        toast.error("Please enter a number as class index");
      }
    }
  }

  function handleCancelDeleteStudent() {
    setIsStudentDeleting({ open: false, id: null });
  }

  async function handleConfirmDeleteStudent() {
    if (isStudentDeleting.id === null) return;
    const studentId = isStudentDeleting.id;
    const res = await deleteEnrollmentAction(classData.id, studentId);
    if (res.success) {
      setRemovedStudentIds((current) => (current.includes(studentId) ? current : [...current, studentId]));
      setAddedStudents((current) => current.filter((student) => student.id !== studentId));
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    handleCancelDeleteStudent();
  }

  const isActionButtonsDisabled = Object.values(disabledSubjectColumns).some(Boolean);

  return (
    <>
      <Dialog open={open}>
        <DialogContent
          showCloseButton={false}
          className="fixed! inset-0! left-0! top-0! h-dvh! max-h-none! w-screen! max-w-none! translate-x-0! translate-y-0! rounded-none! flex flex-col overflow-hidden p-4"
        >
          <DialogHeader className="shrink-0 flex-row items-center justify-between gap-4 pr-10">
            <DialogTitle className="min-w-0 truncate" title={classData.name}>
              Students · {classData.name}
            </DialogTitle>
            <div className="flex gap-3">
              <Button disabled={isActionButtonsDisabled} variant="outline" onClick={() => setIsStudentPickerOpen(true)}>
                <UserPlusIcon />
                Add students
              </Button>
              <Button
                disabled={isActionButtonsDisabled}
                size={"default"}
                onClick={() => onOpenChange(false)}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-auto rounded-md border">
            {isPending ? (
              <LoadingIndicator />
            ) : (
              <Table className="min-w-max" containerClassName="overflow-visible">
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead className="w-24">Class index</TableHead>
                    <TableHead className="w-48">Admission number</TableHead>
                    <TableHead className="sticky left-0 z-20 w-72 bg-background">Student name</TableHead>
                    {classData.subjects.map((subject) => (
                      <TableHead key={subject.id} className="w-60">
                        <div className="flex min-w-0 flex-col gap-1.5 py-1">
                          <span className="truncate max-w-60" title={subject.name}>
                            {subject.name}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 w-full text-xs"
                            disabled={students.length === 0 || disabledSubjectColumns[subject.id]}
                            onClick={() => void toggleAllForSubject(subject.id)}
                          >
                            Toggle all
                          </Button>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="w-20 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Input
                          className="h-8 w-20"
                          ref={(el) => {
                            indexInputRef.current[index] = el;
                          }}
                          value={getClassIndex(student, index)}
                          onChange={(event) =>
                            setClassIndexes((current) => ({ ...current, [student.id]: event.target.value }))
                          }
                          onBlur={(e) => changeStudentClassIndex(student.id, e.target.value)}
                          disabled={isActionButtonsDisabled}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                      </TableCell>
                      <TableCell className="max-w-48 truncate font-mono" title={student.admissionNo}>
                        {student.admissionNo}
                      </TableCell>
                      <TableCell
                        className="sticky left-0 z-10 max-w-72 truncate bg-background"
                        title={student.fullName}
                      >
                        {student.fullName}
                      </TableCell>
                      {classData.subjects.map((subject) => {
                        const enrolled = isEnrolledInSubject(student.id, subject.id);
                        const columnDisabled = disabledSubjectColumns[subject.id] ?? false;
                        const mediumId = getStudentMedium(student.id, subject.id);

                        return (
                          <TableCell key={subject.id} className="w-60 max-w-60">
                            <div className="flex min-w-0 items-center gap-2">
                              <Checkbox
                                checked={enrolled}
                                disabled={columnDisabled}
                                aria-disabled={columnDisabled}
                                onCheckedChange={(checked) =>
                                  void toggleStudentSubject(student.id, subject.id, checked === true)
                                }
                                className="aria-disabled:opacity-50"
                              />
                              <Select
                                items={mediumOptions}
                                value={mediumId}
                                disabled={!enrolled || columnDisabled || isMediumPending}
                                onValueChange={(value) => {
                                  if (value !== null) void changeStudentMedium(student.id, subject.id, value);
                                }}
                              >
                                <SelectTrigger className="h-8 w-full min-w-0">
                                  <SelectValue placeholder="Select medium" className="truncate" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mediumOptions.map((medium) => (
                                    <SelectItem key={medium.value} value={medium.value}>
                                      <span className="max-w-48 truncate" title={medium.label}>
                                        {medium.label}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center">
                        <TooltipButton
                          tooltip="Remove student"
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => setIsStudentDeleting({ open: true, id: student.id })}
                          disabled={isActionButtonsDisabled}
                        >
                          <Trash2Icon />
                        </TooltipButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={classData.subjects.length + 4} className="h-48">
                        <EmptyState
                          noBorder
                          icon={UsersIcon}
                          title="No students in this class"
                          description="Add students to build this class roster."
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isStudentPickerOpen && (
        <StudentPickerDialog
          open
          onOpenChange={setIsStudentPickerOpen}
          selectedStudentIds={students.map((student) => student.id)}
          onAdd={addStudents}
        />
      )}

      {isStudentDeleting.open && (
        <AlertDialog open={isStudentDeleting.open}>
          <AlertDialogContent className="min-w-sm">
            <AlertDialogHeader>
              <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                <AlertTriangleIcon className="size-5" />
              </div>
              <AlertDialogTitle className="text-lg font-semibold">{`Remove '${students.find((st) => st.id === isStudentDeleting.id)!.fullName}'?`}</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this student from this class?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDeleteStudent}>Keep Subject</AlertDialogCancel>
              <AlertDialogAction variant={"destructive"} onClick={handleConfirmDeleteStudent}>
                Remove Student
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
