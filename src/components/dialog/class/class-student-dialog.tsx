"use client";

import StudentPickerDialog, { SelectedStudent } from "@/components/dialog/student-picker-dialog";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import EmptyState from "@/components/ui/empty-state";
import PageLoading from "@/components/ui/page-loading";
import { IClass } from "@/features/class";
import { getMediumOptionsAction } from "@/features/medium/medium.actions";
import { MEDIUM_OPTIONS } from "@/lib/query-keys";
import { getStudentListForClassAction } from "@/features/students/students.actions";
import { IStudentsListItem } from "@/features/students";
import { useQuery } from "@tanstack/react-query";
import { Trash2Icon, UserPlusIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type SubjectColumnState = Record<string, boolean>;
type StudentSubjectState = Record<string, Record<string, boolean>>;
type StudentMediumState = Record<string, Record<string, string>>;

export default function ClassStudentDialog({
  open,
  onOpenChange,
  classData,
  onAddStudents,
  onRemoveStudent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: IClass;
  onAddStudents?: (students: IStudentsListItem[]) => void;
  onRemoveStudent?: (studentId: string) => void;
}) {
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [addedStudents, setAddedStudents] = useState<IStudentsListItem[]>([]);
  const [removedStudentIds, setRemovedStudentIds] = useState<string[]>([]);
  const [classIndexes, setClassIndexes] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      classData.enrollments.map((enrollment) => [enrollment.student.id, String(enrollment.classIndex)]),
    ),
  );
  const [disabledSubjectColumns, setDisabledSubjectColumns] = useState<SubjectColumnState>(() =>
    Object.fromEntries(classData.subjects.map((subject) => [subject.id, false])),
  );
  const [studentSubjectState, setStudentSubjectState] = useState<StudentSubjectState>({});
  const [studentMediumState, setStudentMediumState] = useState<StudentMediumState>({});

  const { data: enrolledStudents = [], isPending } = useQuery({
    enabled: open,
    queryFn: async () => {
      const result = await getStudentListForClassAction(
        classData.academicYear.id,
        classData.gradeLevel.id,
        classData.id,
      );
      if (!result.success) {
        toast.error(result.message);
        throw new Error(result.message);
      }
      return result.data;
    },
    queryKey: ["class-students", classData.academicYear.id, classData.gradeLevel.id, classData.id],
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

  const studentsById = new Map<string, IStudentsListItem>();
  for (const student of enrolledStudents) {
    if (!removedStudentIds.includes(student.id)) studentsById.set(student.id, student);
  }
  for (const student of addedStudents) {
    if (!removedStudentIds.includes(student.id)) studentsById.set(student.id, student);
  }
  const students = Array.from(studentsById.values());

  function addStudents(selectedStudents: SelectedStudent[]) {
    const existingIds = new Set(students.map((student) => student.id));
    const newSelections = selectedStudents.filter(({ student }) => !existingIds.has(student.id));
    if (newSelections.length === 0) return;

    let nextIndex = Math.max(
      students.length,
      ...students.map((student, index) => Number(classIndexes[student.id]) || index + 1),
      ...newSelections.map(({ previousClassIndex }) => previousClassIndex ?? 0),
    );
    const newStudents: IStudentsListItem[] = [];
    const nextIndexes: Record<string, string> = {};
    for (const { student, previousClassIndex } of newSelections) {
      newStudents.push(student);
      if (previousClassIndex !== undefined) {
        nextIndexes[student.id] = String(previousClassIndex);
      } else {
        nextIndexes[student.id] = String(++nextIndex);
      }
    }

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
        next[student.id] = Object.fromEntries(
          classData.subjects.map((subject) => [subject.id, subject.medium?.id ?? classData.defaultMedium?.id ?? ""]),
        );
      }
      return next;
    });
    onAddStudents?.(newStudents);
  }

  function removeStudent(studentId: string) {
    setRemovedStudentIds((current) => (current.includes(studentId) ? current : [...current, studentId]));
    setAddedStudents((current) => current.filter((student) => student.id !== studentId));
    onRemoveStudent?.(studentId);
  }

  function isEnrolledInSubject(studentId: string, subjectId: string) {
    return studentSubjectState[studentId]?.[subjectId] ?? true;
  }

  function getStudentMedium(studentId: string, subjectId: string) {
    const subject = classData.subjects.find((item) => item.id === subjectId);
    return studentMediumState[studentId]?.[subjectId] ?? subject?.medium?.id ?? classData.defaultMedium?.id ?? null;
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
      setStudentSubjectState((current) => ({
        ...current,
        [studentId]: { ...current[studentId], [subjectId]: enrolled },
      }));
      // Add the subject enrollment mutation here.
      await Promise.resolve();
    } finally {
      if (!columnAlreadyDisabled) {
        setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: false }));
      }
    }
  }

  async function toggleAllForSubject(subjectId: string) {
    const nextValue = !students.every((student) => isEnrolledInSubject(student.id, subjectId));
    setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: true }));
    try {
      for (const student of students) {
        await toggleStudentSubject(student.id, subjectId, nextValue, true);
      }
    } finally {
      setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: false }));
    }
  }

  async function changeStudentMedium(studentId: string, subjectId: string, mediumId: string | null) {
    setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: true }));
    try {
      setStudentMediumState((current) => ({
        ...current,
        [studentId]: { ...current[studentId], [subjectId]: mediumId ?? "" },
      }));
      // Add the student subject medium mutation here.
      await Promise.resolve();
    } finally {
      setDisabledSubjectColumns((current) => ({ ...current, [subjectId]: false }));
    }
  }

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
              <Button variant="outline" onClick={() => setIsStudentPickerOpen(true)}>
                <UserPlusIcon />
                Add students
              </Button>
              <Button
                size={"default"}
                onClick={() => {
                  if (confirm("Are you sure you want to close this dialog? Unsaved changes will be lost.")) {
                    onOpenChange(false);
                  }
                }}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-auto rounded-md border">
            {isPending ? (
              <PageLoading />
            ) : (
              <Table className="min-w-max" containerClassName="overflow-visible">
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead className="w-24">Class index</TableHead>
                    <TableHead className="w-48">Admission number</TableHead>
                    <TableHead className="w-72">Student name</TableHead>
                    {classData.subjects.map((subject) => (
                      <TableHead key={subject.id} className="w-60">
                        <div className="flex min-w-0 flex-col gap-1.5 py-1">
                          <span className="truncate" title={subject.name}>
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
                          type="number"
                          min={1}
                          step={1}
                          className="h-8 w-20"
                          value={classIndexes[student.id] ?? String(index + 1)}
                          onChange={(event) =>
                            setClassIndexes((current) => ({ ...current, [student.id]: event.target.value }))
                          }
                        />
                      </TableCell>
                      <TableCell className="max-w-48 truncate font-mono" title={student.admissionNo}>
                        {student.admissionNo}
                      </TableCell>
                      <TableCell className="max-w-72 truncate" title={student.fullName}>
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
                                onCheckedChange={(checked) =>
                                  void toggleStudentSubject(student.id, subject.id, checked === true)
                                }
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
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          title="Remove student"
                          onClick={() => removeStudent(student.id)}
                        >
                          <Trash2Icon />
                        </Button>
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
    </>
  );
}
