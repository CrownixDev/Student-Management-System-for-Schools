"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { BookUserIcon, CheckIcon, EditIcon, UsersIcon } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getClassOptionsAction } from "@/features/class/class.actions";
import { IStudentsListItem } from "@/features/students";
import { IGradeListItem } from "@/features/grades";
import { IAcademicYear } from "@/features/academic-years";
import { IClassOption } from "@/features/class/class.types";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Checkbox } from "@/components/shadcn/checkbox";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { toast } from "react-toastify";
import { Badge } from "@/components/shadcn/badge";
import { Label } from "@/components/shadcn/label";
import GradePickerDialog from "@/components/dialog/grade-picker-dialog";
import YearPickerDialog from "@/components/dialog/year-picker-dialog";
import EmptyState from "@/components/ui/empty-state";
import LoadingIndicator from "@/components/ui/loading-indicator";
import SearchInput from "@/components/ui/search-input";
import DialogPagination from "@/components/ui/dialog/dialog-pagination";
import { rpcTanStack } from "@/lib/orpc/client";

type PickerTab = "all-students" | "by-class";

export type SelectedStudent = {
  student: IStudentsListItem;
  previousClassIndex?: number;
};

function getPreviousClassIndex(student: IStudentsListItem): number | undefined {
  if (!("enrollments" in student) || !Array.isArray(student.enrollments)) return undefined;
  const enrollment = student.enrollments[0];
  if (typeof enrollment !== "object" || enrollment === null || !("classIndex" in enrollment)) return undefined;
  return typeof enrollment.classIndex === "number" ? enrollment.classIndex : undefined;
}

export default function StudentPickerDialog({
  open,
  onOpenChange,
  selectedStudentIds,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudentIds: string[];
  onAdd: (students: SelectedStudent[]) => void;
}) {
  const [activeTab, setActiveTab] = useState<PickerTab>("all-students");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<Map<string, SelectedStudent>>(() => new Map());
  const [year, setYear] = useState<IAcademicYear | null>(null);
  const [grade, setGrade] = useState<IGradeListItem | null>(null);
  const [classId, setClassId] = useState("");
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [isGradePickerOpen, setIsGradePickerOpen] = useState(false);
  const [selectAllInClass, setSelectAllInClass] = useState(false);

  const studentListQuery = useQuery(
    rpcTanStack.student.getList.queryOptions({
      input: { search: search.trim(), page },
      enabled: open && activeTab === "all-students",
      placeholderData: keepPreviousData,
    }),
  );

  const classOptionsQuery = useQuery({
    enabled: open && activeTab === "by-class" && Boolean(year && grade),
    queryKey: ["student-picker-class-options", year?.id, grade?.id],
    queryFn: async () => {
      const result = await getClassOptionsAction(grade!.id);
      if (!result.success) {
        toast.error(result.message);
        throw new Error(result.message);
      }
      return result.data;
    },
  });

  const classStudentsQuery = useQuery(
    rpcTanStack.student.getListForClass.queryOptions({
      input: { classId },
      enabled: open && activeTab === "by-class" && Boolean(classId),
    }),
  );

  const studentsInSelectedClass = classStudentsQuery.data ?? [];
  const availableClassStudents = studentsInSelectedClass.filter((student) => !selectedStudentIds.includes(student.id));

  function toggleStudent(student: IStudentsListItem, checked: boolean, previousClassIndex?: number) {
    setSelectedStudents((current) => {
      const next = new Map(current);
      if (checked) next.set(student.id, { student, previousClassIndex });
      else next.delete(student.id);
      return next;
    });
  }

  function toggleSelectAllInClass(checked: boolean) {
    setSelectAllInClass(checked);
    setSelectedStudents((current) => {
      const next = new Map(current);
      for (const [index, student] of studentsInSelectedClass.entries()) {
        if (selectedStudentIds.includes(student.id)) continue;
        if (checked) {
          const previousClassIndex = getPreviousClassIndex(student) ?? index + 1;
          next.set(student.id, { student, previousClassIndex });
        } else next.delete(student.id);
      }
      return next;
    });
  }

  function selectClass(value: string | null) {
    if (value === null) return;
    setClassId(value);
    setSelectAllInClass(false);
  }

  function addSelectedStudents() {
    const students = Array.from(selectedStudents.values()).filter(
      ({ student }) => !selectedStudentIds.includes(student.id),
    );
    const uniqueStudents = Array.from(new Map(students.map((selection) => [selection.student.id, selection])).values());
    onAdd(uniqueStudents);
    onOpenChange(false);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  const selectedCount = selectedStudents.size;
  const selectedStudentIndexes = new Map(
    Array.from(selectedStudents.keys()).map((studentId, index) => [studentId, index + 1]),
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex min-w-2xl flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>Add students</DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as PickerTab)}
            className="min-h-0 flex-1"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all-students">All students</TabsTrigger>
              <TabsTrigger value="by-class">Select by class</TabsTrigger>
            </TabsList>

            <TabsContent value="all-students" className="flex min-h-0 flex-col gap-3">
              <SearchInput
                placeholder="Search students"
                value={search}
                onChange={handleSearchChange}
                onClear={() => handleSearchChange("")}
              />
              {studentListQuery.isPending ? (
                <LoadingIndicator />
              ) : (
                <ScrollArea className="h-[min(45vh,28rem)] rounded-md border">
                  <div className="divide-y">
                    {studentListQuery.data?.list.map((student) => {
                      const alreadySelected = selectedStudentIds.includes(student.id);
                      const checked = alreadySelected || selectedStudents.has(student.id);
                      const selectedIndex = selectedStudentIndexes.get(student.id);
                      return (
                        <label
                          key={student.id}
                          className={`flex items-center gap-3 px-3 py-2.5 ${
                            alreadySelected ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                          }`}
                        >
                          <Checkbox
                            checked={checked}
                            disabled={alreadySelected}
                            onCheckedChange={(value) => toggleStudent(student, value === true)}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{student.fullName}</p>
                            <p className="truncate text-xs text-muted-foreground">{student.admissionNo}</p>
                          </div>
                          {alreadySelected && (
                            <span className="shrink-0 text-xs text-muted-foreground">Already added</span>
                          )}
                          {selectedIndex !== undefined && <Badge variant="secondary">{selectedIndex}</Badge>}
                        </label>
                      );
                    })}
                    {!studentListQuery.data?.list.length && (
                      <EmptyState
                        noBorder
                        icon={UsersIcon}
                        title="No students found"
                        description={search ? "Try a different search." : "There are no students available."}
                      />
                    )}
                  </div>
                </ScrollArea>
              )}
              <DialogPagination
                itemCount={studentListQuery.data?.count ?? 0}
                page={page}
                onPageChange={setPage}
                disable={{ next: studentListQuery.isPlaceholderData }}
              />
            </TabsContent>

            <TabsContent value="by-class" className="flex min-h-0 flex-col gap-3">
              <div className="grid grid-cols-[1fr_1fr_1.5fr] items-start gap-3">
                <div className="space-y-2">
                  <Label>Academic year</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full min-w-0 justify-between"
                    onClick={() => setIsYearPickerOpen(true)}
                  >
                    <span className="truncate">{year?.name ?? "Select year"}</span>
                    <EditIcon className="size-4 shrink-0" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full min-w-0 justify-between"
                    onClick={() => setIsGradePickerOpen(true)}
                  >
                    <span className="truncate">{grade?.name ?? "Select grade"}</span>
                    <EditIcon className="size-4 shrink-0" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select
                    value={classId}
                    disabled={
                      !year || !grade || classOptionsQuery.isPending || (classOptionsQuery.data?.length ?? 0) === 0
                    }
                    onValueChange={selectClass}
                    items={classOptionsQuery.data ?? []}
                  >
                    <SelectTrigger className="w-full min-w-0">
                      {(!year || !grade) && <SelectValue placeholder={"Select year and grade first"} />}
                      {year && grade && (
                        <SelectValue
                          placeholder={
                            classOptionsQuery.isPending
                              ? "Loading classes..."
                              : classOptionsQuery.data?.length === 0
                                ? "No classes available"
                                : "Select a class"
                          }
                        />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {(classOptionsQuery.data ?? []).map((classOption: IClassOption) => (
                        <SelectItem key={classOption.value} value={classOption.value}>
                          {classOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {classStudentsQuery.isPending && classId ? (
                <LoadingIndicator />
              ) : classId ? (
                <>
                  <label className="flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5">
                    <Checkbox
                      checked={
                        availableClassStudents.length > 0 &&
                        availableClassStudents.every((student) => selectedStudents.has(student.id))
                      }
                      disabled={availableClassStudents.length === 0}
                      onCheckedChange={(checked) => toggleSelectAllInClass(checked === true)}
                    />
                    <span className="text-sm font-medium">Select all students in this class</span>
                  </label>
                  <ScrollArea className="h-[min(38vh,24rem)] rounded-md border">
                    <div className="divide-y">
                      {studentsInSelectedClass.map((student, index) => {
                        const alreadySelected = selectedStudentIds.includes(student.id);
                        const checked = alreadySelected || selectedStudents.has(student.id);
                        const selectedIndex = selectedStudentIndexes.get(student.id);
                        const previousClassIndex = getPreviousClassIndex(student) ?? index + 1;
                        return (
                          <label
                            key={student.id}
                            className={`flex items-center gap-3 px-3 py-2.5 ${
                              selectAllInClass || alreadySelected ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            }`}
                          >
                            <Checkbox
                              checked={checked}
                              disabled={selectAllInClass || alreadySelected}
                              onCheckedChange={(checkedValue) =>
                                toggleStudent(student, checkedValue === true, previousClassIndex)
                              }
                            />
                            <span className="min-w-0 flex-1 truncate text-sm">{student.fullName}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {student.admissionNo} · Index {previousClassIndex}
                            </span>
                            {alreadySelected && (
                              <span className="shrink-0 text-xs text-muted-foreground">Already added</span>
                            )}
                            {selectedIndex !== undefined && <Badge variant="secondary">{selectedIndex}</Badge>}
                          </label>
                        );
                      })}
                      {studentsInSelectedClass.length === 0 && (
                        <EmptyState
                          noBorder
                          icon={BookUserIcon}
                          title="No students in this class"
                          description="Select another class or add students to this class first."
                        />
                      )}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex h-[min(38vh,24rem)] items-center justify-center rounded-md border text-sm text-muted-foreground">
                  Select an academic year and grade, then choose a class.
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="shrink-0">
            <div className="mr-auto flex items-center gap-2 text-sm text-muted-foreground">
              <CheckIcon className="size-4" />
              {selectedCount} selected
            </div>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={addSelectedStudents} disabled={selectedCount === 0}>
              Add {selectedCount} student{selectedCount === 1 ? "" : "s"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isYearPickerOpen && (
        <YearPickerDialog
          open
          onOpenChange={setIsYearPickerOpen}
          selectedYearId={year?.id}
          onSelect={(selectedYear) => {
            setYear(selectedYear);
            setGrade(null);
            setClassId("");
            setSelectAllInClass(false);
          }}
        />
      )}
      {isGradePickerOpen && year && (
        <GradePickerDialog
          open
          onOpenChange={setIsGradePickerOpen}
          selectedGradeId={grade?.id}
          onSelect={(selectedGrade) => {
            setGrade(selectedGrade);
            setClassId("");
            setSelectAllInClass(false);
          }}
          year={year}
        />
      )}
    </>
  );
}
