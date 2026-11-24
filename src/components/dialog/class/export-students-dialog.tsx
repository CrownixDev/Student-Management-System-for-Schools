"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircleAlertIcon, UsersRoundIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import EmptyState from "@/components/ui/empty-state";
import LoadingIndicator from "@/components/ui/loading-indicator";
import { IClass } from "@/features/class";
import { IStudentProfile } from "@/features/students";
import { exportExcelSheet } from "@/lib/excell";
import { rpcTanStack } from "@/lib/orpc/client";

type ExcelCell = string | number | boolean | Date | null | undefined;

type ExportFieldItem = {
  key: string;
  label: string;
  getValue: (student: IStudentProfile) => ExcelCell;
};

const baseStudentFields: ExportFieldItem[] = [
  { key: "admissionNo", label: "Admission No.", getValue: (s) => s.admissionNo },
  { key: "fullName", label: "Full Name", getValue: (s) => s.fullName },
  { key: "dob", label: "Date of Birth", getValue: (s) => s.dob },
  { key: "gender", label: "Gender", getValue: (s) => s.gender },
  { key: "nic", label: "NIC", getValue: (s) => s.nic },
  { key: "phone", label: "Phone", getValue: (s) => s.phone },
  { key: "address", label: "Address", getValue: (s) => s.address },
  { key: "guardianName", label: "Guardian Name", getValue: (s) => s.guardianName },
  { key: "guardianPhone", label: "Guardian Phone", getValue: (s) => s.guardianPhone },
  { key: "status", label: "Status", getValue: (s) => s.status },
];

type FieldPreference = {
  enabled: boolean;
  heading: string;
};

export default function ExportStudentsDialog({
  open,
  onOpenChange,
  classData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: IClass;
}) {
  const [fieldPreferences, setFieldPreferences] = useState<Record<string, FieldPreference>>({});
  const {
    data: students = [],
    isPending: isStudentsPending,
    isError: isStudentsError,
    refetch: refetchStudents,
  } = useQuery(
    rpcTanStack.student.getProfileListForClass.queryOptions({
      enabled: open,
      input: { classId: classData.id },
    }),
  );

  const {
    data: customFields = [],
    isPending: isCustomFieldsPending,
    isError: isCustomFieldsError,
    refetch: refetchCustomFields,
  } = useQuery(
    rpcTanStack.student.getJsonFields.queryOptions({
      enabled: open,
    }),
  );

  const allFields: ExportFieldItem[] = [
    ...baseStudentFields,
    ...customFields.map(
      (cf): ExportFieldItem => ({
        key: `custom_${cf.name}`,
        label: cf.name,
        getValue: (student: IStudentProfile): ExcelCell => {
          const val = (student.json as Record<string, unknown>)?.[cf.name];
          if (val === undefined || val === null || val === "") return "-";
          if (cf.type === "date" && (typeof val === "string" || typeof val === "number" || val instanceof Date)) {
            try {
              return new Date(val);
            } catch {
              return String(val);
            }
          }
          if (typeof val === "string" || typeof val === "number" || typeof val === "boolean" || val instanceof Date) {
            return val;
          }
          return String(val);
        },
      }),
    ),
  ];

  const isPending = isStudentsPending || isCustomFieldsPending;
  const isError = isStudentsError || isCustomFieldsError;

  function updateField(key: string, preference: FieldPreference) {
    setFieldPreferences((current) => ({ ...current, [key]: preference }));
  }

  function exportStudents() {
    const enabledFields = allFields.filter((field) => fieldPreferences[field.key]?.enabled !== false);
    const headers = enabledFields.map((field) => fieldPreferences[field.key]?.heading || field.label);
    const rows = students.map((student) =>
      enabledFields.map((field) => {
        const value = field.getValue(student);
        return value instanceof Date ? value : (value ?? "-");
      }),
    );

    exportExcelSheet({
      fileName: `${classData.gradeLevel.academicYear.name} - ${classData.gradeLevel.name} - ${classData.name}`,
      sheetName: "Students",
      headers,
      rows,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export class students</DialogTitle>
          <DialogDescription>Choose which student fields to include and edit their column headings.</DialogDescription>
        </DialogHeader>
        {isPending ? (
          <LoadingIndicator />
        ) : isError ? (
          <EmptyState
            icon={CircleAlertIcon}
            title="Could not load students"
            description="There was a problem loading this class's student profiles."
          />
        ) : students.length === 0 ? (
          <EmptyState
            icon={UsersRoundIcon}
            title="No students to export"
            description="This class has no student profiles available."
          />
        ) : (
          <div className="grid gap-3">
            {allFields.map((field) => {
              const preference = fieldPreferences[field.key] ?? { enabled: true, heading: field.label };
              return (
                <div key={field.key} className="flex items-center gap-3">
                  <Checkbox
                    checked={preference.enabled}
                    onCheckedChange={(checked) => updateField(field.key, { ...preference, enabled: checked === true })}
                    aria-label={`Export ${field.label}`}
                  />
                  <Input
                    value={preference.heading}
                    onChange={(event) => updateField(field.key, { ...preference, heading: event.target.value })}
                    disabled={!preference.enabled}
                    aria-label={`${field.label} heading`}
                  />
                </div>
              );
            })}
          </div>
        )}
        <DialogFooter>
          {isError ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void refetchStudents();
                void refetchCustomFields();
              }}
            >
              Try again
            </Button>
          ) : (
            <Button type="button" onClick={exportStudents} disabled={isPending || students.length === 0}>
              Export as Excel sheet
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
