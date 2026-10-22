"use client";

import SubjectPickerDialog from "@/components/dialog/subject-picker-dialog";
import TeacherPickerDialog from "@/components/dialog/teacher-picker-dialog";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { referenceOptions } from "@/components/setup/classes/classes.data";
import { IClass } from "@/features/class";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import RenderDialogErrors from "../compoennts/render-dialog-errors";

type ClassSubject = IClass["subjects"][number];

export default function ClassSubjectsDialog({
  open,
  onOpenChange,
  data,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: IClass;
  onSave?: (savedClass: Partial<IClass>) => void;
}) {
  const [subjects, setSubjects] = useState<ClassSubject[]>(data.subjects);
  const [teacherSubjectIndex, setTeacherSubjectIndex] = useState<number | null>(null);
  const [choosingSubjects, setChoosingSubjects] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  function updateSubject(index: number, changes: Partial<ClassSubject>) {
    setSubjects((current) =>
      current.map((subject, subjectIndex) =>
        subjectIndex === index ? { ...subject, ...changes } : subject,
      ),
    );
  }

  function addSubjects(subjectIds: string[]) {
    setSubjects((current) => {
      const existingIds = new Set(current.map((subject) => subject.id));
      return [
        ...current,
        ...subjectIds
          .filter((id) => !existingIds.has(id))
          .map((id) => {
            const subject = referenceOptions.subjects.find((item) => item.id === id);
            return {
              id,
              name: subject?.name ?? "",
              code: subject?.code ?? null,
              category: subject?.category ?? "other",
              medium: data.defaultMedium,
              teacher: {
                id: referenceOptions.teachers[0]?.id ?? "",
                fullName: referenceOptions.teachers[0]?.fullName ?? "",
              },
            };
          }),
      ];
    });
  }

  function saveSubjects() {
    if (subjects.some((subject) => !subject.medium || !subject.teacher.id)) {
      setErrors(["Select a teaching medium and teacher for each subject."]);
      return;
    }

    const savedClass: Partial<IClass> = { id: data.id, subjects };
    console.log("Class subjects draft:", savedClass);
    onSave?.(savedClass);
    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[92dvh] flex-col overflow-hidden sm:max-w-3xl">
          <DialogHeader className="shrink-0">
            <DialogTitle>Manage subjects · {data.name}</DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium">Class subjects</h3>
                <p className="text-xs text-muted-foreground">
                  Select a teaching medium and teacher for each subject.
                </p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => setChoosingSubjects(true)}>
                <PlusIcon />
                Add subject
              </Button>
            </div>

            <div className="max-h-[min(60vh,36rem)] space-y-3 overflow-y-auto rounded-md border p-3">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-md border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                  <div className="min-w-0 self-center">
                    <p className="truncate text-sm font-medium">{subject.name}</p>
                    {subject.code && <p className="truncate text-xs text-muted-foreground">{subject.code}</p>}
                  </div>
                  <Select
                    value={subject.medium?.id ?? "none"}
                    onValueChange={(value) => {
                      if (value === null) return;
                      updateSubject(index, {
                        medium:
                          value === "none"
                            ? null
                            : (referenceOptions.mediums.find((medium) => medium.id === value) ?? null),
                      });
                    }}
                  >
                    <SelectTrigger
                      className="col-span-2 w-full min-w-0 sm:col-span-1"
                      aria-label={`Medium for ${subject.name}`}
                    >
                      <SelectValue placeholder="Teaching medium" />
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
                  <Button
                    type="button"
                    variant="outline"
                    className="col-span-2 w-full min-w-0 justify-between sm:col-span-1"
                    onClick={() => setTeacherSubjectIndex(index)}
                  >
                    <span className="truncate">{subject.teacher.fullName || "Select subject teacher"}</span>
                    <PencilIcon className="size-4 shrink-0" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="col-start-2 row-start-1 justify-self-end sm:col-start-auto sm:row-start-auto"
                    aria-label={`Remove ${subject.name}`}
                    onClick={() => setSubjects((current) => current.filter((item) => item.id !== subject.id))}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              ))}
              {subjects.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No subjects added yet.</p>
              )}
            </div>
            <RenderDialogErrors errors={errors} />
          </div>

          <DialogFooter className="shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveSubjects}>
              Save subjects
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {choosingSubjects && (
        <SubjectPickerDialog
          open
          onOpenChange={setChoosingSubjects}
          selectedSubjectIds={subjects.map((subject) => subject.id)}
          onAdd={addSubjects}
        />
      )}
      {teacherSubjectIndex !== null && (
        <TeacherPickerDialog
          open
          title="Select subject teacher"
          onOpenChange={(isOpen) => {
            if (!isOpen) setTeacherSubjectIndex(null);
          }}
          selectedTeacherId={subjects[teacherSubjectIndex]?.teacher.id ?? ""}
          onSelect={(teacherId) => {
            const teacher = referenceOptions.teachers.find((item) => item.id === teacherId);
            if (teacher) updateSubject(teacherSubjectIndex, { teacher });
          }}
        />
      )}
    </>
  );
}
