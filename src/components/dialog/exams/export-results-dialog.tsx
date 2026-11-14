"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { IExamListItem, IExamTopResults } from "@/features/exams";
import { IClassListWithSubjectsItem } from "@/features/class";
import { exportExcelSheet } from "@/lib/excell";
import { useState } from "react";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Button } from "@/components/shadcn/button";

type ExportTab = "byGrade" | "byClass" | "bySubject";
type SortDirection = "asc" | "desc";
type ExportCell = string | number | null;
type ExportRow = Record<string, ExportCell>;

interface ExportColumn {
  key: string;
  label: string;
}

interface ColumnPreference {
  enabled: boolean;
  heading: string;
}

interface ExportResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: IExamTopResults;
  classesWithSubjects: IClassListWithSubjectsItem[];
  exam: IExamListItem;
}

const gradeColumns: ExportColumn[] = [
  { key: "place", label: "Place" },
  { key: "fullName", label: "Full Name" },
  { key: "admissionNo", label: "Addmission No." },
  { key: "class", label: "Class" },
  { key: "fullMarks", label: "Full Marks" },
];

const subjectColumns: ExportColumn[] = [
  { key: "place", label: "Place" },
  { key: "fullName", label: "Full Name" },
  { key: "admissionNo", label: "Addmission No." },
  { key: "class", label: "Class" },
  { key: "fullMarks", label: "Full Marks" },
  { key: "medium", label: "Medium" },
];

const sortingOptions = [
  { value: "", label: "No sort" },
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
] satisfies { value: string; label: string }[];

function getDisplayValue(value: ExportCell): ExportCell {
  return value ?? "-";
}

function ColumnSettings({
  tab,
  columns,
  preferences,
  onPreferenceChange,
  sortableKeys = [],
  sortKey,
  sortDirection,
  onSortChange,
}: {
  tab: ExportTab;
  columns: ExportColumn[];
  preferences: Record<string, ColumnPreference>;
  onPreferenceChange: (key: string, preference: ColumnPreference) => void;
  sortableKeys?: string[];
  sortKey: string | null;
  sortDirection: SortDirection | null;
  onSortChange: (tab: ExportTab, key: string, direction: SortDirection | null) => void;
}) {
  return (
    <div className="grid gap-3">
      {columns.map((column) => {
        const preference = preferences[`${tab}:${column.key}`] ?? {
          enabled: true,
          heading: column.label,
        };
        const isSortable = sortableKeys.includes(column.key);

        return (
          <div key={column.key} className="flex items-center gap-3">
            <Checkbox
              checked={preference.enabled}
              onCheckedChange={(checked) =>
                onPreferenceChange(`${tab}:${column.key}`, {
                  ...preference,
                  enabled: checked === true,
                })
              }
              aria-label={`Export ${column.label}`}
            />
            <Input
              value={preference.heading}
              onChange={(event) =>
                onPreferenceChange(`${tab}:${column.key}`, {
                  ...preference,
                  heading: event.target.value,
                })
              }
              disabled={!preference.enabled}
              aria-label={`${column.label} heading`}
            />

            {isSortable && (
              <Select
                items={sortingOptions}
                value={sortKey === column.key ? (sortDirection ?? "") : ""}
                disabled={!preference.enabled}
                onValueChange={(value) => onSortChange(tab, column.key, value ? (value as SortDirection) : null)}
              >
                <SelectTrigger className="w-32 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sortingOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ExportResultsDialog({
  open,
  onOpenChange,
  results,
  classesWithSubjects,
  exam,
}: ExportResultsDialogProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>("byGrade");
  const [selectedClassId, setSelectedClassId] = useState(results.byClass[0]?.id ?? "");
  const [selectedSubjectId, setSelectedSubjectId] = useState(results.bySubject[0]?.id ?? "");
  const [preferences, setPreferences] = useState<Record<string, ColumnPreference>>({});
  const [sortPreferences, setSortPreferences] = useState<
    Record<ExportTab, { key: string | null; direction: SortDirection | null }>
  >({
    byGrade: { key: null, direction: null },
    byClass: { key: null, direction: null },
    bySubject: { key: null, direction: null },
  });

  const selectedClass = results.byClass.find((classResult) => classResult.id === selectedClassId);
  const selectedSubject = results.bySubject.find((subjectResult) => subjectResult.id === selectedSubjectId);
  const classSubjects = classesWithSubjects.find((classItem) => classItem.id === selectedClass?.id)?.subjects ?? [];

  const classColumns: ExportColumn[] = [
    { key: "place", label: "Place" },
    { key: "classIndex", label: "Class Index" },
    { key: "fullName", label: "Full Name" },
    { key: "admissionNo", label: "Addmission No." },
    ...classSubjects.map((subject) => ({
      key: `subject:${subject.id}`,
      label: subject.code ?? subject.name,
    })),
    { key: "fullMarks", label: "Full Marks" },
    { key: "average", label: "Average" },
  ];

  const gradeRows: ExportRow[] = results.byGrade.map((student, index) => ({
    place: index + 1,
    fullName: student.fullName,
    admissionNo: student.admissionNo,
    class: student.class.name,
    fullMarks: student.fullMarks,
  }));

  const classRows: ExportRow[] = (() => {
    if (!selectedClass) return [];

    return selectedClass.topResult.map((student, index) => {
      const row: ExportRow = {
        place: index + 1,
        classIndex: getDisplayValue(student.classIndex),
        fullName: student.fullName,
        admissionNo: student.admissionNo,
      };

      for (const subject of classSubjects) {
        const result = student.subjects.find((studentSubject) => studentSubject.id === subject.id);
        row[`subject:${subject.id}`] =
          result?.result.status === "absent"
            ? "Absent"
            : result?.result.status === "present"
              ? getDisplayValue(result.result.marks)
              : "-";
      }

      row.fullMarks = student.fullMarks;
      row.average = classSubjects.length > 0 ? `${(student.fullMarks / classSubjects.length).toFixed(1)} %` : "-";
      return row;
    });
  })();

  const subjectRows: ExportRow[] =
    selectedSubject?.topResult.map((student, index) => ({
      place: index + 1,
      fullName: student.fullName,
      admissionNo: student.admissionNo,
      class: student.class.name,
      fullMarks: student.status === "present" ? student.fullMarks : "Absent",
      medium: getDisplayValue(student.medium),
    })) ?? [];

  function updatePreference(key: string, preference: ColumnPreference) {
    setPreferences((current) => ({ ...current, [key]: preference }));
    if (!preference.enabled) {
      const [tab, columnKey] = key.split(":");
      if ((tab === "byGrade" || tab === "byClass" || tab === "bySubject") && sortPreferences[tab].key === columnKey) {
        setSortPreferences((current) => ({ ...current, [tab]: { key: null, direction: null } }));
      }
    }
  }

  function updateSort(tab: ExportTab, key: string, direction: SortDirection | null) {
    const currentSort = sortPreferences[tab];
    if (direction === null) {
      if (currentSort.key === key) {
        setSortPreferences((current) => ({ ...current, [tab]: { key: null, direction: null } }));
      }
      return;
    }

    setSortPreferences((current) => ({ ...current, [tab]: { key, direction } }));
  }

  function exportCurrentTab() {
    const config: { columns: ExportColumn[]; rows: ExportRow[]; sheetName: string } = {
      byGrade: { columns: gradeColumns, rows: gradeRows, sheetName: "By Grade" },
      byClass: { columns: classColumns, rows: classRows, sheetName: "By Class" },
      bySubject: { columns: subjectColumns, rows: subjectRows, sheetName: "By Subject" },
    }[activeTab];
    const enabledColumns = config.columns.filter(
      (column) => preferences[`${activeTab}:${column.key}`]?.enabled !== false,
    );
    const currentSort = sortPreferences[activeTab];
    const orderedRows = [...config.rows];
    if (currentSort.key && currentSort.direction && enabledColumns.some((column) => column.key === currentSort.key)) {
      const sortMultiplier = currentSort.direction === "asc" ? 1 : -1;
      orderedRows.sort((left, right) => {
        const leftValue = left[currentSort.key!];
        const rightValue = right[currentSort.key!];
        const leftIsEmpty = leftValue === null || leftValue === undefined || leftValue === "-";
        const rightIsEmpty = rightValue === null || rightValue === undefined || rightValue === "-";
        if (leftIsEmpty && rightIsEmpty) return 0;
        if (leftIsEmpty) return 1;
        if (rightIsEmpty) return -1;
        return (leftValue! < rightValue! ? -1 : leftValue! > rightValue! ? 1 : 0) * sortMultiplier;
      });
    }
    const headers = enabledColumns.map((column) => preferences[`${activeTab}:${column.key}`]?.heading || column.label);
    const rows = orderedRows.map((row) => enabledColumns.map((column) => row[column.key] ?? "-"));

    exportExcelSheet({
      fileName: [
        exam.name,
        exam.gradeLevel.name,
        ...(activeTab === "byClass" && selectedClass ? [selectedClass.name] : []),
        ...(activeTab === "bySubject" && selectedSubject ? [selectedSubject.name] : []),
      ].join(" - "),
      sheetName: config.sheetName,
      rows,
      headers,
    });
  }

  function renderSettings(tab: ExportTab, columns: ExportColumn[], sortableKeys: string[] = []) {
    const currentSort = sortPreferences[tab];
    return (
      <ColumnSettings
        tab={tab}
        columns={columns}
        preferences={preferences}
        onPreferenceChange={updatePreference}
        sortableKeys={sortableKeys}
        sortKey={currentSort.key}
        sortDirection={currentSort.direction}
        onSortChange={updateSort}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex min-h-150 max-h-150 flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export results</DialogTitle>
          <DialogDescription>Choose the fields and headings to include in the Excel file.</DialogDescription>
        </DialogHeader>
        <Tabs
          value={activeTab}
          className="min-h-0 flex-1"
          onValueChange={(value) => {
            if (value === "byGrade" || value === "byClass" || value === "bySubject") setActiveTab(value);
          }}
        >
          <TabsList className="w-full">
            <TabsTrigger value="byGrade">By Grade</TabsTrigger>
            <TabsTrigger value="byClass">By Class</TabsTrigger>
            <TabsTrigger value="bySubject">By Subject</TabsTrigger>
          </TabsList>
          <TabsContent value="byGrade" className="-mr-4 mt-4 min-h-0 overflow-y-auto pr-4">
            {renderSettings("byGrade", gradeColumns)}
          </TabsContent>
          <TabsContent value="byClass" className="-mr-4 mt-4 min-h-0 overflow-y-auto pr-4">
            <label className="mb-4 flex items-center gap-3">
              <span className="shrink-0">Class</span>

              <Select
                items={results.byClass.map((cls) => ({ value: cls.id, label: cls.name }))}
                value={selectedClassId}
                onValueChange={(value) => (value ? setSelectedClassId(value) : undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {results.byClass.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
            {selectedClass ? (
              renderSettings("byClass", classColumns, ["place", "classIndex"])
            ) : (
              <p className="text-muted-foreground">No class results are available to export.</p>
            )}
          </TabsContent>
          <TabsContent value="bySubject" className="-mr-4 mt-4 min-h-0 overflow-y-auto pr-4">
            <label className="mb-4 flex items-center gap-3">
              <span className="shrink-0">Subject</span>

              <Select
                items={results.bySubject.map((sub) => ({ value: sub.id, label: sub.name }))}
                value={selectedSubjectId}
                onValueChange={(value) => (value ? setSelectedSubjectId(value) : undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {results.bySubject.map((subjectResult) => (
                      <SelectItem key={subjectResult.id} value={subjectResult.id}>
                        {subjectResult.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
            {selectedSubject ? (
              renderSettings("bySubject", subjectColumns)
            ) : (
              <p className="text-muted-foreground">No subject results are available to export.</p>
            )}
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            onClick={exportCurrentTab}
            disabled={(activeTab === "byClass" && !selectedClass) || (activeTab === "bySubject" && !selectedSubject)}
          >
            Export as Excel sheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
