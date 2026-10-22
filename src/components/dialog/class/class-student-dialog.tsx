"use client";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { previousClassesMock } from "@/components/setup/classes/classes.data";
import { IEnrolledStudentItem, IPreviousClassOption } from "@/components/setup/classes/classes.types";
import { IClass } from "@/features/class";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { useMemo, useState } from "react";

type EnrollmentMode = "previous-class" | "individual";
type CurrentEnrollment = IClass["enrollments"][number];

function createEnrollments(
  sourceStudents: IPreviousClassOption["students"],
  currentEnrollmentCount: number,
): IEnrolledStudentItem[] {
  return sourceStudents.map((student, index) => ({
    id: `enrollment-${student.studentId}-${Date.now()}-${index}`,
    studentId: student.studentId,
    classIndex: currentEnrollmentCount + index + 1,
    status: "active",
    admissionNo: student.admissionNo,
    fullName: student.fullName,
    gender: student.gender,
    phone: null,
    guardianName: null,
    guardianPhone: null,
    joinedOn: new Date().toISOString().slice(0, 10),
  }));
}

export default function ClassStudentDialog({
  open,
  onOpenChange,
  className,
  currentEnrollments,
  currentEnrollmentCount,
  onSaveSelection,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className: string;
  currentEnrollments: CurrentEnrollment[];
  currentEnrollmentCount: number;
  onSaveSelection?: (selection: {
    keepEnrollmentIds: string[];
    addStudents: IEnrolledStudentItem[];
  }) => void;
}) {
  const [activeTab, setActiveTab] = useState<"current" | "add">("current");
  const [mode, setMode] = useState<EnrollmentMode | "">("");
  const [step, setStep] = useState<"choose" | "select">("choose");
  const [yearId, setYearId] = useState("");
  const [gradeName, setGradeName] = useState("");
  const [sourceClassId, setSourceClassId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [keepEnrollmentIds, setKeepEnrollmentIds] = useState<string[]>(
    () => currentEnrollments.map((enrollment) => enrollment.id),
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const years = Array.from(new Map(previousClassesMock.map((item) => [item.yearId, item.yearName])).entries());
  const grades = Array.from(
    new Set(previousClassesMock.filter((item) => item.yearId === yearId).map((item) => item.gradeName)),
  );
  const sourceClasses = previousClassesMock.filter((item) => item.yearId === yearId && item.gradeName === gradeName);
  const selectedSourceClass = previousClassesMock.find((item) => item.classId === sourceClassId);
  const allIndividualStudents = useMemo(() => {
    const uniqueStudents = new Map<string, IPreviousClassOption["students"][number]>();
    previousClassesMock.forEach((sourceClass) =>
      sourceClass.students.forEach((student) => uniqueStudents.set(student.studentId, student)),
    );
    return Array.from(uniqueStudents.values());
  }, []);
  const filteredIndividualStudents = allIndividualStudents.filter((student) =>
    [student.fullName, student.admissionNo].some((value) =>
      value.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    ),
  );
  const pageCount = Math.max(1, Math.ceil(filteredIndividualStudents.length / pageSize));
  const pageStudents = filteredIndividualStudents.slice((page - 1) * pageSize, page * pageSize);
  const currentEnrollmentIds = new Set(currentEnrollments.map((enrollment) => enrollment.id));
  const hasCurrentEnrollmentChanges =
    keepEnrollmentIds.some((id) => !currentEnrollmentIds.has(id)) ||
    currentEnrollments.some((enrollment) => !keepEnrollmentIds.includes(enrollment.id));
  const alreadyEnrolledStudentIds = new Set(currentEnrollments.map((enrollment) => enrollment.student.id));
  const importRoster = mode === "previous-class" && selectedSourceClass;

  function toggleStudent(studentId: string, checked: boolean) {
    setSelectedStudentIds((current) =>
      checked ? [...new Set([...current, studentId])] : current.filter((id) => id !== studentId),
    );
  }

  function toggleCurrentEnrollment(enrollmentId: string) {
    setKeepEnrollmentIds((current) =>
      current.includes(enrollmentId)
        ? current.filter((id) => id !== enrollmentId)
        : [...current, enrollmentId],
    );
  }

  function beginSelection() {
    if (!mode) return;
    setStep("select");
    setSearch("");
    setPage(1);
    setSelectedStudentIds([]);
    setYearId("");
    setGradeName("");
    setSourceClassId("");
  }

  function selectSourceClass(sourceClass: IPreviousClassOption) {
    setSourceClassId(sourceClass.classId);
    setSelectedStudentIds(
      sourceClass.students
        .filter((student) => !alreadyEnrolledStudentIds.has(student.studentId))
        .map((student) => student.studentId),
    );
  }

  function saveSelection(addStudents: IEnrolledStudentItem[] = []) {
    onSaveSelection?.({ keepEnrollmentIds, addStudents });
    onOpenChange(false);
  }

  function saveAddedStudents() {
    const sourceStudents =
      mode === "previous-class"
        ? (selectedSourceClass?.students.filter((student) => selectedStudentIds.includes(student.studentId)) ?? [])
        : allIndividualStudents.filter((student) => selectedStudentIds.includes(student.studentId));
    const addStudents = createEnrollments(
      sourceStudents.filter((student) => !alreadyEnrolledStudentIds.has(student.studentId)),
      currentEnrollmentCount,
    );
    saveSelection(addStudents);
  }

  function goBack() {
    setStep("choose");
    setSelectedStudentIds([]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] flex-col overflow-hidden sm:max-w-xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Manage students · {className}</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "current" | "add")}
          className="min-h-0 flex-1"
        >
          <TabsList className="grid w-full shrink-0 grid-cols-2">
            <TabsTrigger value="current">Current students ({currentEnrollments.length})</TabsTrigger>
            <TabsTrigger value="add">Add students</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="min-h-0 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {keepEnrollmentIds.length} of {currentEnrollments.length} students will remain enrolled.
              </p>
            </div>
            <ScrollArea className="h-[min(55vh,26rem)] rounded-md border">
              <div className="divide-y">
                {currentEnrollments.map((enrollment) => {
                  const willRemain = keepEnrollmentIds.includes(enrollment.id);
                  return (
                    <div
                      key={enrollment.id}
                      className={`flex items-center gap-3 px-3 py-2.5 ${
                        willRemain ? "" : "text-muted-foreground"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm ${willRemain ? "font-medium" : "line-through"}`}>
                          {enrollment.student.fullName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {enrollment.student.admissionNo} · Index {enrollment.classIndex}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant={willRemain ? "ghost" : "outline"}
                        size="icon-sm"
                        aria-label={
                          willRemain
                            ? `Remove ${enrollment.student.fullName}`
                            : `Keep ${enrollment.student.fullName}`
                        }
                        title={willRemain ? "Remove student" : "Undo removal"}
                        onClick={() => toggleCurrentEnrollment(enrollment.id)}
                      >
                        {willRemain ? <Trash2Icon /> : <ChevronLeftIcon />}
                      </Button>
                    </div>
                  );
                })}
                {currentEnrollments.length === 0 && (
                  <p className="p-5 text-center text-sm text-muted-foreground">
                    No students currently enrolled.
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="add" className="min-h-0">
            {step === "choose" ? (
              <RadioGroup
                value={mode}
                onValueChange={(value) => setMode(value as EnrollmentMode)}
                className="max-h-[min(55vh,26rem)] gap-3 overflow-y-auto py-2"
              >
                <label className="flex cursor-pointer items-start gap-3 rounded-md border p-4">
                  <RadioGroupItem value="previous-class" className="mt-0.5" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">Import from a previous-year class</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      Choose a year, grade, and class, then review its student list.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-md border p-4">
                  <RadioGroupItem value="individual" className="mt-0.5" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">Select students individually</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      Search the student list and choose students to add.
                    </span>
                  </span>
                </label>
              </RadioGroup>
            ) : (
              <div className="max-h-[min(55vh,26rem)] space-y-4 overflow-y-auto py-2">
                {mode === "previous-class" ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="previous-year" className="text-sm font-medium">
                          Academic year
                        </label>
                        <Select
                          value={yearId}
                          onValueChange={(value) => {
                            if (value === null) return;
                            setYearId(value);
                            setGradeName("");
                            setSourceClassId("");
                            setSelectedStudentIds([]);
                          }}
                        >
                          <SelectTrigger id="previous-year">
                            <SelectValue placeholder="Select a year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map(([id, name]) => (
                              <SelectItem key={id} value={id}>{name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="previous-grade" className="text-sm font-medium">Grade</label>
                        <Select
                          value={gradeName}
                          disabled={!yearId}
                          onValueChange={(value) => {
                            if (value === null) return;
                            setGradeName(value);
                            setSourceClassId("");
                            setSelectedStudentIds([]);
                          }}
                        >
                          <SelectTrigger id="previous-grade">
                            <SelectValue placeholder="Select a grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {grades.map((grade) => (
                              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {yearId && gradeName && (
                      <section className="space-y-2">
                        <h3 className="text-sm font-medium">Classes</h3>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {sourceClasses.map((sourceClass) => (
                            <Button
                              key={sourceClass.classId}
                              type="button"
                              variant={sourceClassId === sourceClass.classId ? "secondary" : "outline"}
                              className="h-auto justify-between gap-2 py-3"
                              onClick={() => selectSourceClass(sourceClass)}
                            >
                              <span>{sourceClass.className}</span>
                              <span className="text-xs text-muted-foreground">
                                {sourceClass.students.length} students
                              </span>
                            </Button>
                          ))}
                        </div>
                      </section>
                    )}
                    {importRoster && (
                      <section className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="min-w-0 truncate text-sm font-medium">
                            Students in {importRoster.className}
                          </h3>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setSelectedStudentIds((current) =>
                                current.length ===
                                importRoster.students.filter(
                                  (student) => !alreadyEnrolledStudentIds.has(student.studentId),
                                ).length
                                  ? []
                                  : importRoster.students
                                      .filter((student) => !alreadyEnrolledStudentIds.has(student.studentId))
                                      .map((student) => student.studentId),
                              )
                            }
                          >
                            Select/clear all
                          </Button>
                        </div>
                        <ScrollArea className="h-40 rounded-md border">
                          <div className="divide-y">
                            {importRoster.students.map((student) => {
                              const alreadyEnrolled = alreadyEnrolledStudentIds.has(student.studentId);
                              return (
                                <label
                                  key={student.studentId}
                                  className={`flex items-center gap-3 px-3 py-2 ${
                                    alreadyEnrolled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                                  }`}
                                >
                                  <Checkbox
                                    checked={alreadyEnrolled || selectedStudentIds.includes(student.studentId)}
                                    disabled={alreadyEnrolled}
                                    onCheckedChange={(checked) => toggleStudent(student.studentId, checked === true)}
                                  />
                                  <span className="min-w-0 flex-1 truncate text-sm">{student.fullName}</span>
                                  <span className="shrink-0 text-xs text-muted-foreground">
                                    {alreadyEnrolled ? "Already enrolled" : student.admissionNo}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </section>
                    )}
                  </>
                ) : (
                  <section className="space-y-3">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Search students by name or admission number"
                        value={search}
                        onChange={(event) => {
                          setSearch(event.target.value);
                          setPage(1);
                        }}
                      />
                    </div>
                    <ScrollArea className="h-48 rounded-md border">
                      <div className="divide-y">
                        {pageStudents.map((student) => {
                          const alreadyEnrolled = alreadyEnrolledStudentIds.has(student.studentId);
                          return (
                            <label
                              key={student.studentId}
                              className={`flex items-center gap-3 px-3 py-2 ${
                                alreadyEnrolled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                              }`}
                            >
                              <Checkbox
                                checked={alreadyEnrolled || selectedStudentIds.includes(student.studentId)}
                                disabled={alreadyEnrolled}
                                onCheckedChange={(checked) => toggleStudent(student.studentId, checked === true)}
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium">{student.fullName}</span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  {student.admissionNo}
                                </span>
                              </span>
                              <span className="shrink-0 text-xs capitalize text-muted-foreground">
                                {alreadyEnrolled ? "Enrolled" : student.gender}
                              </span>
                            </label>
                          );
                        })}
                        {pageStudents.length === 0 && (
                          <p className="p-5 text-center text-sm text-muted-foreground">No students found.</p>
                        )}
                      </div>
                    </ScrollArea>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {selectedStudentIds.length} selected · {filteredIndividualStudents.length} students
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          aria-label="Previous page"
                          disabled={page <= 1}
                          onClick={() => setPage((current) => current - 1)}
                        >
                          <ChevronLeftIcon />
                        </Button>
                        <span className="text-xs tabular-nums">{page} / {pageCount}</span>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          aria-label="Next page"
                          disabled={page >= pageCount}
                          onClick={() => setPage((current) => current + 1)}
                        >
                          <ChevronRightIcon />
                        </Button>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="shrink-0">
          {activeTab === "current" ? (
            <>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => saveSelection()}
                disabled={!hasCurrentEnrollmentChanges}
              >
                Save student changes
              </Button>
            </>
          ) : step === "choose" ? (
            <>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" disabled={!mode} onClick={beginSelection}>
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={goBack}>
                Back
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={saveAddedStudents}
                disabled={
                  !selectedStudentIds.length ||
                  (mode === "previous-class" && !importRoster)
                }
              >
                <UsersIcon />
                Add {selectedStudentIds.length} student{selectedStudentIds.length === 1 ? "" : "s"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
