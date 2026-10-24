"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowUp, Keyboard, Save } from "lucide-react";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/shadcn/hover-card";
import { Input } from "@/components/shadcn/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import type { IExamClassData } from "@/features/exams";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/shadcn/sidebar";

type Student = IExamClassData["students"][number];
type Subject = Student["subjects"][number];
type CellKey = `${string}:${string}`;
type SortDirection = 1 | -1;
type MarkStatus = "present" | "absent";

type MarkDraft = {
  value: string;
  status: MarkStatus;
};

export type ExamMarkInput = {
  enrollmentId: string;
  subjectId: string;
  marks: number | null;
  status: MarkStatus;
};

function cellKey(enrollmentId: string, subjectId: string): CellKey {
  return `${enrollmentId}:${subjectId}`;
}

function isValidMark(value: string): boolean {
  if (value.trim() === "") return true;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue >= 0 && numericValue <= 100;
}

function getSubjects(students: Student[]): Subject[] {
  const byId = new Map<string, Subject>();
  for (const student of students) {
    for (const subject of student.subjects) {
      if (!byId.has(subject.id)) byId.set(subject.id, subject);
    }
  }
  return Array.from(byId.values());
}

function KeyboardShortcuts() {
  return (
    <HoverCard>
      <HoverCardTrigger delay={300} render={<Button type="button" variant="outline" size="icon" />}>
        <Keyboard aria-hidden="true" />
      </HoverCardTrigger>
      <HoverCardContent className="w-80 space-y-3">
        <p className="font-medium">Keyboard shortcuts</p>
        <dl className="space-y-2 text-xs">
          <Shortcut label="Move to next eligible student in this subject" keys="Enter" />
          <Shortcut label="Move to previous eligible student in this subject" keys="Shift+Enter" />
          <Shortcut label="Move to the next eligible subject" keys="Tab" />
          <Shortcut label="Move to the previous eligible subject" keys="Shift+Tab" />
        </dl>
      </HoverCardContent>
    </HoverCard>
  );
}

function Shortcut({ label, keys }: { label: string; keys: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd>
        <kbd className="rounded border px-1.5 py-0.5 font-mono">{keys}</kbd>
      </dd>
    </div>
  );
}

function ExamMarksHeader({
  examName,
  examData,
  isEditing,
  isSaving,
  onToggleEditing,
  onSave,
}: {
  examName: string;
  examData: IExamClassData;
  isEditing: boolean;
  isSaving: boolean;
  onToggleEditing: () => void;
  onSave: () => void;
}) {
  function onCancel() {
    if (confirm("All Edited/Updated marks will be lost. Are you sure you want to cancel?")) {
      onToggleEditing();
    }
  }
  return (
    <header className="flex shrink-0 flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex gap-5">
        <SidebarTrigger />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{examName} marks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {examData.academicYear.name} - {examData.gradeLevel.name} - {examData.name}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <KeyboardShortcuts />
        {isEditing ? (
          <>
            <Button type="button" variant="destructive" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={onSave} disabled={isSaving}>
              <Save aria-hidden="true" />
              {isSaving ? "Saving..." : "Save marks"}
            </Button>
          </>
        ) : (
          <Button type="button" onClick={onToggleEditing}>
            Edit marks
          </Button>
        )}
      </div>
    </header>
  );
}

function MarksTable({
  examName,
  students,
  subjects,
  isEditing,
  sortDirection,
  onToggleSort,
  findDraft,
  registerInput,
  onUpdateDraft,
  onInputKeyDown,
}: {
  examName: string;
  students: Student[];
  subjects: Subject[];
  isEditing: boolean;
  sortDirection: SortDirection;
  onToggleSort: () => void;
  findDraft: (student: Student, subjectId: string) => MarkDraft;
  registerInput: (key: CellKey, element: HTMLInputElement | null) => void;
  onUpdateDraft: (enrollmentId: string, subjectId: string, draft: MarkDraft) => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>, student: Student, subjectId: string) => void;
}) {
  return (
    <div className="min-h-0 min-w-0 max-w-full flex-1 rounded-xl border bg-card">
      <Table
        containerClassName="h-full min-h-0 w-full min-w-0 max-w-full overflow-auto rounded-xl"
        className="min-w-max border-separate border-spacing-0"
      >
        <caption className="sr-only">Exam marks for class {examName}. Students can be sorted by class index.</caption>
        <TableHeader>
          <MarksTableHeader subjects={subjects} sortDirection={sortDirection} onToggleSort={onToggleSort} />
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <MarksTableRow
              key={student.enrollmentId}
              student={student}
              subjects={subjects}
              isEditing={isEditing}
              findDraft={findDraft}
              registerInput={registerInput}
              onUpdateDraft={onUpdateDraft}
              onInputKeyDown={onInputKeyDown}
            />
          ))}
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3 + subjects.length} className="h-32 text-center text-muted-foreground">
                No students are included in this class.
              </TableCell>
            </TableRow>
          ) : null}
          {students.length > 0 && subjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">
                No subject data is available for these students.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

function MarksTableHeader({
  subjects,
  sortDirection,
  onToggleSort,
}: {
  subjects: Subject[];
  sortDirection: SortDirection;
  onToggleSort: () => void;
}) {
  return (
    <TableRow className="bg-muted hover:bg-muted">
      <TableHead
        aria-sort={sortDirection === 1 ? "ascending" : "descending"}
        className="sticky left-0 top-0 z-40 w-[76px] min-w-[76px] bg-muted text-right"
      >
        <button
          type="button"
          className="inline-flex items-center justify-end gap-1.5"
          onClick={onToggleSort}
          aria-label={`Sort class index ${sortDirection === 1 ? "descending" : "ascending"}`}
        >
          Index
          {sortDirection === 1 ? (
            <ArrowUp className="size-3.5" aria-hidden="true" />
          ) : (
            <ArrowDown className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </TableHead>
      <TableHead className="sticky left-[76px] top-0 z-40 w-[160px] min-w-[160px] bg-muted">Admission no.</TableHead>
      <TableHead className="sticky left-[236px] top-0 z-40 w-[260px] min-w-[260px] bg-muted">Student name</TableHead>
      {subjects.map((subject) => (
        <TableHead key={subject.id} className="sticky top-0 z-30 min-w-[176px] bg-muted">
          <div className="flex flex-col gap-0.5">
            <span>{subject.name}</span>
          </div>
        </TableHead>
      ))}
    </TableRow>
  );
}

function MarksTableRow({
  student,
  subjects,
  isEditing,
  findDraft,
  registerInput,
  onUpdateDraft,
  onInputKeyDown,
}: {
  student: Student;
  subjects: Subject[];
  isEditing: boolean;
  findDraft: (student: Student, subjectId: string) => MarkDraft;
  registerInput: (key: CellKey, element: HTMLInputElement | null) => void;
  onUpdateDraft: (enrollmentId: string, subjectId: string, draft: MarkDraft) => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>, student: Student, subjectId: string) => void;
}) {
  return (
    <TableRow className="h-14">
      <TableCell className="sticky left-0 z-20 w-[76px] min-w-[76px] bg-background text-right font-mono text-xs">
        {student.classIndex}
      </TableCell>
      <TableCell className="sticky left-[76px] z-20 w-[160px] min-w-[160px] bg-background font-mono text-xs text-muted-foreground">
        {student.admissionNo}
      </TableCell>
      <TableCell className="sticky left-[236px] z-20 w-[260px] min-w-[260px] whitespace-normal [overflow-wrap:anywhere] bg-background font-medium">
        {student.fullName}
      </TableCell>
      {subjects.map((subject) => (
        <MarkCell
          key={subject.id}
          student={student}
          subject={subject}
          isEditing={isEditing}
          draft={findDraft(student, subject.id)}
          registerInput={registerInput}
          onUpdateDraft={onUpdateDraft}
          onInputKeyDown={onInputKeyDown}
        />
      ))}
    </TableRow>
  );
}

function MarkCell({
  student,
  subject,
  isEditing,
  draft,
  registerInput,
  onUpdateDraft,
  onInputKeyDown,
}: {
  student: Student;
  subject: Subject;
  isEditing: boolean;
  draft: MarkDraft;
  registerInput: (key: CellKey, element: HTMLInputElement | null) => void;
  onUpdateDraft: (enrollmentId: string, subjectId: string, draft: MarkDraft) => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>, student: Student, subjectId: string) => void;
}) {
  if (!student.subjects.some((item) => item.id === subject.id)) {
    return (
      <TableCell>
        <span className="inline-flex rounded-md bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
          Not taking subject
        </span>
      </TableCell>
    );
  }

  if (!isEditing) {
    return (
      <TableCell className="tabular-nums">
        {draft.status === "absent" ? (
          <Badge variant="outline">Absent</Badge>
        ) : draft.value.trim() === "" ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          draft.value
        )}
      </TableCell>
    );
  }

  if (draft.status === "absent") {
    return (
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge variant="destructive">Absent</Badge>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onUpdateDraft(student.enrollmentId, subject.id, { value: "", status: "present" })}
            aria-label={`Clear absence for ${student.fullName}, ${subject.name}`}
          >
            Clear
          </Button>
        </div>
      </TableCell>
    );
  }

  const key = cellKey(student.enrollmentId, subject.id);
  return (
    <TableCell>
      <div className="flex items-center gap-1.5">
        <Input
          ref={(element) => registerInput(key, element)}
          className="h-9 w-24 tabular-nums"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          step="any"
          value={draft.value}
          aria-label={`${student.fullName}, class index ${student.classIndex}, ${subject.name}, maximum 100`}
          aria-invalid={!isValidMark(draft.value) || undefined}
          onChange={(event) =>
            onUpdateDraft(student.enrollmentId, subject.id, { value: event.target.value, status: "present" })
          }
          onKeyDown={(event) => onInputKeyDown(event, student, subject.id)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onUpdateDraft(student.enrollmentId, subject.id, { value: "", status: "absent" })}
          aria-label={`Mark ${student.fullName} absent in ${subject.name}`}
        >
          Absent
        </Button>
      </div>
    </TableCell>
  );
}

export function ExamMarksPage({ examName, examData }: { examName: string; examData: IExamClassData }) {
  const [draftState, setDraftState] = useState<{
    source: IExamClassData;
    values: Partial<Record<CellKey, MarkDraft>>;
  }>(() => ({ source: examData, values: {} }));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection>(1);
  const [message, setMessage] = useState("");
  const inputRefs = useRef(new Map<CellKey, HTMLInputElement>());
  const drafts = draftState.source === examData ? draftState.values : {};

  const router = useRouter();

  const subjects = useMemo(() => getSubjects(examData.students), [examData.students]);
  const students = useMemo(
    () => [...examData.students].sort((left, right) => (left.classIndex - right.classIndex) * sortDirection),
    [examData.students, sortDirection],
  );

  function findDraft(student: Student, subjectId: string): MarkDraft {
    const subject = student.subjects.find((item) => item.id === subjectId);
    if (!subject) return { value: "", status: "present" };
    return (
      drafts[cellKey(student.enrollmentId, subjectId)] ?? {
        value: subject.result.marks == null ? "" : String(subject.result.marks),
        status: subject.result.status,
      }
    );
  }

  function updateDraft(enrollmentId: string, subjectId: string, draft: MarkDraft) {
    const key = cellKey(enrollmentId, subjectId);
    setDraftState((current) => ({
      source: examData,
      values: {
        ...(current.source === examData ? current.values : {}),
        [key]: draft,
      },
    }));
  }

  function focusCell(enrollmentId: string, subjectId: string) {
    requestAnimationFrame(() => inputRefs.current.get(cellKey(enrollmentId, subjectId))?.focus());
  }

  function registerInput(key: CellKey, element: HTMLInputElement | null) {
    if (element) inputRefs.current.set(key, element);
    else inputRefs.current.delete(key);
  }

  function focusStudentInSubject(studentIndex: number, subjectId: string, direction: SortDirection) {
    for (let index = studentIndex + direction; index >= 0 && index < students.length; index += direction) {
      const student = students[index];
      if (student.subjects.some((subject) => subject.id === subjectId)) {
        focusCell(student.enrollmentId, subjectId);
        return;
      }
    }
  }

  function focusSubjectForStudent(student: Student, subjectId: string, direction: SortDirection) {
    const eligibleSubjects = subjects.filter((subject) =>
      student.subjects.some((studentSubject) => studentSubject.id === subject.id),
    );
    const currentIndex = eligibleSubjects.findIndex((subject) => subject.id === subjectId);
    const nextSubject = eligibleSubjects[currentIndex + direction];
    if (nextSubject) focusCell(student.enrollmentId, nextSubject.id);
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>, student: Student, subjectId: string) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!isValidMark(findDraft(student, subjectId).value)) {
        setMessage("Enter a mark from 0 to 100 before moving to another student.");
        return;
      }
      const studentIndex = students.findIndex((entry) => entry.enrollmentId === student.enrollmentId);
      focusStudentInSubject(studentIndex, subjectId, event.shiftKey ? -1 : 1);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setMessage("Your edits are kept. Use Save to pass them to the save handler.");
      return;
    }

    if (event.key === "Tab") {
      const direction = event.shiftKey ? -1 : 1;
      const eligibleSubjects = subjects.filter((subject) =>
        student.subjects.some((studentSubject) => studentSubject.id === subject.id),
      );
      const currentIndex = eligibleSubjects.findIndex((subject) => subject.id === subjectId);
      if (eligibleSubjects[currentIndex + direction]) {
        event.preventDefault();
        focusSubjectForStudent(student, subjectId, direction);
      }
    }
  }

  async function saveMarks() {
    const marks: ExamMarkInput[] = [];

    for (const student of examData.students) {
      for (const subject of student.subjects) {
        const draft = findDraft(student, subject.id);
        if (!isValidMark(draft.value)) {
          setMessage(`${student.fullName}: enter a mark from 0 to 100.`);
          focusCell(student.enrollmentId, subject.id);
          return;
        }
        marks.push({
          enrollmentId: student.enrollmentId,
          subjectId: subject.id,
          marks: draft.status === "absent" || draft.value.trim() === "" ? null : Number(draft.value),
          status: draft.status,
        });
      }
    }

    setIsSaving(true);
    try {
      console.log(marks);
      setMessage(`${marks.length} student-subject marks passed to the save handler.`);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "The marks could not be passed to the save handler.");
    } finally {
      setIsSaving(false);
    }
  }

  const eligibleCount = examData.students.reduce((count, student) => count + student.subjects.length, 0);
  const markedCount = examData.students.reduce(
    (count, student) =>
      count +
      student.subjects.filter((subject) => {
        const draft = findDraft(student, subject.id);
        return draft.status === "absent" || draft.value.trim() !== "";
      }).length,
    0,
  );

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
      <ExamMarksHeader
        examName={examName}
        examData={examData}
        isEditing={isEditing}
        isSaving={isSaving}
        onToggleEditing={() => {
          setIsEditing((current) => !current);
          router.refresh();
        }}
        onSave={saveMarks}
      />
      <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3" aria-labelledby="marks-table-title">
        <MarksTable
          examName={examData.name}
          students={students}
          subjects={subjects}
          isEditing={isEditing}
          sortDirection={sortDirection}
          onToggleSort={() => setSortDirection((direction) => (direction === 1 ? -1 : 1))}
          findDraft={findDraft}
          registerInput={registerInput}
          onUpdateDraft={updateDraft}
          onInputKeyDown={onInputKeyDown}
        />
        <p className="min-h-5 shrink-0 text-sm text-muted-foreground" role="status" aria-live="polite">
          {message || `${markedCount} of ${eligibleCount} eligible marks have been entered.`}
        </p>
      </section>
    </div>
  );
}
