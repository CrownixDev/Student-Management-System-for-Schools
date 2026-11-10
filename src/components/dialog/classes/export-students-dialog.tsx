"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
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
import { getStudentProfileListForClassAction } from "@/features/students/students.actions";
import { IStudentProfile } from "@/features/students";
import { exportExcelSheet } from "@/lib/excell";

const CLASS_STUDENT_PROFILES = "class-student-profiles";

const studentFields: { key: keyof IStudentProfile; label: string }[] = [
  { key: "admissionNo", label: "Admission No." },
  { key: "fullName", label: "Full Name" },
  { key: "dob", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "nic", label: "NIC" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "guardianName", label: "Guardian Name" },
  { key: "guardianPhone", label: "Guardian Phone" },
  { key: "status", label: "Status" },
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
    isPending,
    isError,
    refetch,
  } = useQuery({
    enabled: open,
    queryFn: async () => {
      const result = await getStudentProfileListForClassAction(classData.id);
      if (!result.success) {
        toast.error(result.message);
        throw new Error(result.message);
      }
      return result.data;
    },
    queryKey: [CLASS_STUDENT_PROFILES, classData.id],
  });

  function updateField(key: keyof IStudentProfile, preference: FieldPreference) {
    setFieldPreferences((current) => ({ ...current, [key]: preference }));
  }

  function exportStudents() {
    const enabledFields = studentFields.filter((field) => fieldPreferences[field.key]?.enabled !== false);
    const headers = enabledFields.map((field) => fieldPreferences[field.key]?.heading || field.label);
    const rows = students.map((student) =>
      enabledFields.map((field) => {
        const value = student[field.key];
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
            {studentFields.map((field) => {
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
            <Button type="button" variant="outline" onClick={() => void refetch()}>
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
