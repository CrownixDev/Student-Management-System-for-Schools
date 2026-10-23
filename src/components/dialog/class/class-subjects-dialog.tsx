"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Card, CardContent } from "@/components/shadcn/card";
import { FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { IClass } from "@/features/class";
import { BookOpenIcon, Loader2Icon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMediumOptionsAction } from "@/features/medium/medium.actions";
import { toast } from "react-toastify";
import { MEDIUM_OPTIONS } from "@/lib/query-keys";
import { ISubjectListItem } from "@/features/subjects";
import TeacherPickerDialog from "@/components/dialog/teacher-picker-dialog";
import SubjectPickerDialog from "@/components/dialog/subject-picker-dialog";
import EmptyState from "@/components/ui/empty-state";
import RenderDialogErrors from "../compoennts/render-dialog-errors";

interface ClassSubject {
  id: string;
  name: string;
  code: string | null;
  teacher: {
    id: string;
    fullName: string;
  } | null;
  mediumId: string | null;
}

export interface IClassSubjectsDialogData {
  classId: string;
  subjects: {
    subjectId: string;
    teacherId: string;
    mediumId: string | null;
  }[];
}

export default function ClassSubjectsDialog({
  open,
  onOpenChange,
  data,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: IClass;
  onSave: (data: IClassSubjectsDialogData) => void;
}) {
  const [subjects, setSubjects] = useState<ClassSubject[]>(
    data.subjects.map((sub) => ({ ...sub, mediumId: sub.medium?.id ?? null })),
  );
  const [teacherSubjectIndex, setTeacherSubjectIndex] = useState<number | null>(null);
  const [choosingSubjects, setChoosingSubjects] = useState(false);
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

  function updateSubject(index: number, changes: Partial<ClassSubject>) {
    setSubjects((current) =>
      current.map((subject, subjectIndex) => (subjectIndex === index ? { ...subject, ...changes } : subject)),
    );
  }

  function addSubjects(subjecs: ISubjectListItem[]) {
    setSubjects((current) => {
      const existingIds = new Set(current.map((subject) => subject.id));
      return [
        ...current,
        ...subjecs
          .filter((sub) => !existingIds.has(sub.id))
          .map((sub) => {
            return {
              id: sub.id,
              name: sub.name,
              code: sub?.code ?? null,
              mediumId: data.defaultMedium?.id ?? null,
              teacher: null,
            };
          }),
      ];
    });
  }

  function saveSubjects() {
    if (subjects.some((subject) => !subject.teacher?.id)) {
      setErrors(["Select a teacher for each subject."]);
      return;
    }

    onSave({
      classId: data.id,
      subjects: subjects.map((sub) => ({
        subjectId: sub.id,
        teacherId: sub.teacher!.id,
        mediumId: sub.mediumId,
      })),
    });

    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex h-[min(85vh,52rem)] max-h-[calc(100vh-2rem)] w-[min(64rem,calc(100vw-2rem))] max-w-none! flex-col overflow-hidden">
          <DialogHeader className="min-w-0 shrink-0">
            <DialogTitle className="truncate" title={data.name}>
              Class {data.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <FieldLabel>Subjects</FieldLabel>
              <Button type="button" size="sm" variant="outline" onClick={() => setChoosingSubjects(true)}>
                <PlusIcon />
                Add subject
              </Button>
            </div>
            <div className="min-h-0 overflow-y-auto flex-1 rounded-md border">
              <FieldGroup className="gap-3 p-3">
                {subjects.map((subject, index) => (
                  <Card key={subject.id} className="min-w-0">
                    <CardContent className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(14rem,0.8fr)_minmax(16rem,1fr)_auto] items-center gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium" title={subject.name}>
                          {subject.name}
                        </p>
                        {subject.code && (
                          <p className="truncate text-xs text-muted-foreground" title={subject.code}>
                            {subject.code}
                          </p>
                        )}
                      </div>

                      {isMediumPending ? (
                        <div className="flex h-8 min-w-0 items-center gap-2 truncate rounded-md border px-3 text-sm text-muted-foreground">
                          <Loader2Icon className="size-4 shrink-0 animate-spin" />
                          <span className="truncate">Getting medium list...</span>
                        </div>
                      ) : (
                        <Select
                          items={mediumOptions}
                          value={subject.mediumId ?? null}
                          onValueChange={(value) => {
                            if (value !== null) {
                              updateSubject(index, { mediumId: value === "none" ? null : value });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full min-w-0">
                            <SelectValue placeholder="Select a medium" className="truncate" />
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

                      <Button
                        type="button"
                        variant={subject.teacher?.fullName ? "outline" : "destructive"}
                        className="w-full min-w-0 justify-between"
                        onClick={() => setTeacherSubjectIndex(index)}
                      >
                        <span className="truncate" title={subject.teacher?.fullName ?? undefined}>
                          {subject.teacher?.fullName ?? "Select subject teacher"}
                        </span>
                        <PencilIcon className="size-4 shrink-0" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="shrink-0"
                        onClick={() => setSubjects((current) => current.filter((item) => item.id !== subject.id))}
                      >
                        <Trash2Icon />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {subjects.length === 0 && (
                  <EmptyState
                    noBorder
                    icon={BookOpenIcon}
                    title="No subjects added"
                    description="Add subjects to this class to manage their teaching medium and teacher."
                  />
                )}
              </FieldGroup>
            </div>
            <div className="shrink-0">
              <RenderDialogErrors errors={errors} />
            </div>
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
          selectedTeacherId={subjects[teacherSubjectIndex]?.teacher?.id ?? ""}
          onSelect={(teacher) => {
            updateSubject(teacherSubjectIndex, { teacher });
          }}
        />
      )}
    </>
  );
}
