"use client";

import TeacherPickerDialog from "@/components/dialog/teacher-picker-dialog";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { referenceOptions } from "@/components/setup/classes/classes.data";
import { IClass } from "@/features/class";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import RenderDialogErrors from "../compoennts/render-dialog-errors";

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
  onSave?: (savedClass: Partial<IClass>) => void;
}) {
  const [name, setName] = useState(data?.name ?? "");
  const [defaultMediumId, setDefaultMediumId] = useState(data?.defaultMedium?.id ?? "none");
  const [classTeacherId, setClassTeacherId] = useState(data?.classTeacher?.id ?? "");
  const [changingTeacher, setChangingTeacher] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const selectedTeacher = referenceOptions.teachers.find((teacher) => teacher.id === classTeacherId);

  function saveClassDetails() {
    const nextErrors: string[] = [];
    if (!name.trim()) nextErrors.push("Class name is required.");
    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }

    const defaultMedium =
      defaultMediumId === "none"
        ? null
        : (referenceOptions.mediums.find((medium) => medium.id === defaultMediumId) ?? null);
    const classTeacher = referenceOptions.teachers.find((teacher) => teacher.id === classTeacherId);
    const savedClass: Partial<IClass> = {
      ...(data ? { id: data.id } : {}),
      name: name.trim(),
      defaultMedium,
      classTeacher: classTeacher ? { id: classTeacher.id, fullName: classTeacher.fullName, phone: null } : null,
      batch: data?.batch ?? null,
    };

    console.log("Class details draft:", savedClass);
    onSave?.(savedClass);
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
                <FieldLabel htmlFor="class-academic-year">Academic year</FieldLabel>
                <Input id="class-academic-year" value={year.name} disabled />
              </Field>

              <Field>
                <FieldLabel htmlFor="class-academic-year">Grade</FieldLabel>
                <Input id="class-academic-year" value={grade.name} disabled />
              </Field>

              <Field>
                <FieldLabel htmlFor="class-name">Class name</FieldLabel>
                <Input
                  id="class-name"
                  value={name}
                  placeholder="e.g. 10-A"
                  onChange={(event) => {
                    setName(event.target.value);
                    setErrors([]);
                  }}
                />
              </Field>

              <Field>
                <FieldLabel>Default teaching medium</FieldLabel>
                <Select
                  value={defaultMediumId}
                  onValueChange={(value) => {
                    if (value !== null) setDefaultMediumId(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not set</SelectItem>
                    {referenceOptions.mediums.map((medium) => (
                      <SelectItem key={medium.id} value={medium.id}>
                        {medium.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Class teacher</FieldLabel>
              <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-sm">
                  {selectedTeacher?.fullName ?? data?.classTeacher?.fullName ?? "No teacher selected"}
                </span>
                <Button type="button" size="sm" variant="outline" onClick={() => setChangingTeacher(true)}>
                  <PencilIcon />
                  Change
                </Button>
              </div>
            </Field>
          </FieldGroup>

          <RenderDialogErrors errors={errors} />

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
            <Button type="button" onClick={saveClassDetails}>
              {data ? "Save changes" : "Create class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {changingTeacher && (
        <TeacherPickerDialog
          open
          onOpenChange={setChangingTeacher}
          selectedTeacherId={classTeacherId}
          onSelect={setClassTeacherId}
        />
      )}
    </>
  );
}
