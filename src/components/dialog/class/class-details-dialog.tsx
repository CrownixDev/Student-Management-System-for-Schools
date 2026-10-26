"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { IClass } from "@/features/class";
import { Loader2Icon, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MEDIUM_OPTIONS } from "@/lib/query-keys";
import { getMediumOptionsAction } from "@/features/medium/medium.actions";
import { toast } from "react-toastify";
import DialogErrors from "@/components/ui/dialog/dialog-errors";
import TeacherPickerDialog from "@/components/dialog/teacher-picker-dialog";

export interface IClassDetailsDialogData {
  name: string;
  mediumId: string | null;
  teacherId: string | null;
}

export default function ClassDetailsDialog({
  open,
  onOpenChange,
  data,
  year,
  grade,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IClass;
  year: IClass["academicYear"];
  grade: IClass["gradeLevel"];
  onSave: (data: IClassDetailsDialogData) => void;
}) {
  interface ClassDetails {
    name: string;
    mediumId: string | null;
    teacher: IClass["classTeacher"];
  }

  const [classDetails, setClassDetails] = useState<ClassDetails>({
    name: data?.name ?? "",
    mediumId: data?.defaultMedium?.id ?? null,
    teacher: data?.classTeacher ?? null,
  });

  const [changingTeacher, setChangingTeacher] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const { data: mediumOptions = [], isPending: isMediumPending } = useQuery({
    enabled: open,
    queryFn: async () => {
      const res = await getMediumOptionsAction();
      if (res.success) {
        return res.data;
      } else {
        toast.error(res.message);
        throw new Error(res.message);
      }
    },
    queryKey: [MEDIUM_OPTIONS],
  });

  function saveClassDetails() {
    const nextErrors: string[] = [];

    if (!classDetails.name.trim()) nextErrors.push("Class name is required.");

    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      name: classDetails.name,
      mediumId: classDetails.mediumId,
      teacherId: classDetails.teacher?.id ?? null,
    });

    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{data ? `Edit class: ${data.name}` : "Create class"}</DialogTitle>
          </DialogHeader>

          <FieldGroup className="gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Academic year</FieldLabel>
                <Input value={year.name} disabled />
              </Field>

              <Field>
                <FieldLabel>Grade</FieldLabel>
                <Input value={grade.name} disabled />
              </Field>

              <Field>
                <FieldLabel htmlFor="class-name">Class name</FieldLabel>
                <Input
                  id="class-name"
                  value={classDetails.name}
                  placeholder="e.g. 10-A"
                  onChange={(e) => {
                    setClassDetails((preData) => ({
                      ...preData,
                      name: e.target.value,
                    }));
                    setErrors([]);
                  }}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="medium-select">Default teaching medium</FieldLabel>
                {isMediumPending && (
                  <Select>
                    <SelectTrigger>
                      <SelectValue>
                        <Loader2Icon className="animate-spin" />
                        Getting medium list...
                      </SelectValue>
                    </SelectTrigger>
                  </Select>
                )}
                {!isMediumPending && (
                  <Select
                    id="medium-select"
                    items={[{ value: "none", label: "Not set" }, ...mediumOptions]}
                    value={classDetails.mediumId}
                    onValueChange={(value) => {
                      if (value !== null)
                        if (value === "none") {
                          setClassDetails((preData) => ({ ...preData, mediumId: null }));
                        } else {
                          setClassDetails((preData) => ({ ...preData, mediumId: value }));
                        }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not set</SelectItem>
                      {mediumOptions.map((medium) => (
                        <SelectItem key={medium.value} value={medium.value}>
                          {medium.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel>Class teacher</FieldLabel>
              <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-sm">
                  {classDetails.teacher?.fullName ?? "No teacher selected"}
                </span>
                {classDetails.teacher && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setClassDetails((preData) => ({ ...preData, teacher: null }))}
                  >
                    <XIcon />
                    Remove
                  </Button>
                )}
                <Button type="button" size="sm" variant="outline" onClick={() => setChangingTeacher(true)}>
                  <PencilIcon />
                  Change
                </Button>
              </div>
            </Field>
          </FieldGroup>

          <DialogErrors errors={errors} />

          <DialogFooter>
            {data && (
              <Button
                type="button"
                variant="destructive"
                className="sm:mr-auto"
                onClick={() => console.log("Delete class:", data.id)}
              >
                <TrashIcon />
                Delete class
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveClassDetails} disabled={!classDetails.name}>
              {data ? "Save changes" : "Create class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {changingTeacher && (
        <TeacherPickerDialog
          open
          onOpenChange={setChangingTeacher}
          selectedTeacherId={classDetails.teacher?.id}
          onSelect={(teacher) => setClassDetails((preData) => ({ ...preData, teacher }))}
        />
      )}
    </>
  );
}
