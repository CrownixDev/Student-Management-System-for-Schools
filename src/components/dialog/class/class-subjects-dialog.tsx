"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Card, CardContent } from "@/components/shadcn/card";
import { FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { IClass } from "@/features/class";
import { AlertTriangleIcon, BookOpenIcon, EditIcon, Loader2Icon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMediumOptionsAction } from "@/features/medium/medium.actions";
import { toast } from "react-toastify";
import { MEDIUM_OPTIONS } from "@/lib/query-keys";
import { ISubjectListItem } from "@/features/subjects";
import { classSubjectsSchema } from "@/features/class/class.schema";
import { deleteClassSubjectAction, updateClassSubjectsAction } from "@/features/class/class.actions";
import TeacherPickerDialog from "@/components/dialog/teacher-picker-dialog";
import SubjectPickerDialog from "@/components/dialog/subject-picker-dialog";
import EmptyState from "@/components/ui/empty-state";
import DialogErrors from "@/components/ui/dialog/dialog-errors";
import TooltipButton from "@/components/ui/tooltip-button";
import { cn } from "cn";

interface ClassSubject {
  id: string;
  name: string;
  code: string | null;
  mediumId: string | null;
  teacher: {
    id: string;
    fullName: string;
  } | null;
}

export default function ClassSubjectsDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: IClass;
}) {
  const [subjects, setSubjects] = useState<ClassSubject[]>(
    data.subjects.map((sub) => ({ ...sub, mediumId: sub.medium.id })),
  );
  const [teacherSubjectIndex, setTeacherSubjectIndex] = useState<number | null>(null);
  const [choosingSubjects, setChoosingSubjects] = useState(false);
  const [isSubjectDeleting, setIsSubjectDeleting] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
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

  useEffect(() => {
    function setMedium() {
      if (mediumOptions.length > 0) {
        setSubjects((prev) => prev.map((sub) => (sub.mediumId ? sub : { ...sub, mediumId: mediumOptions[0].value })));
      }
    }
    setMedium();
  }, [mediumOptions, subjects.length]);

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
              mediumId: null,
              teacher: null,
            };
          }),
      ];
    });
  }

  function handleCancelDeleteSubject() {
    setIsSubjectDeleting({ open: false, id: null });
  }

  function handleRequestDeleteSubject(subjectId: string) {
    const isExistingSubject = Boolean(data?.subjects.find((s) => s.id === subjectId));
    if (isExistingSubject) {
      setIsSubjectDeleting({ open: true, id: subjectId });
    } else {
      setSubjects((prev) => prev.filter((sub) => sub.id !== subjectId));
    }
  }

  async function handleConfirmDeleteSubject() {
    if (isSubjectDeleting.id === null) return;
    const res = await deleteClassSubjectAction(data.id, isSubjectDeleting.id);
    if (res.success) {
      setSubjects((prev) => prev.filter((sub) => sub.id !== isSubjectDeleting.id));
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    handleCancelDeleteSubject();
  }

  async function saveSubjects() {
    if (subjects.some((subject) => !subject.mediumId)) {
      setErrors(["Select a medium for each subject."]);
      return;
    }

    const parsedRes = classSubjectsSchema.safeParse(
      subjects.map((sub) => ({
        subjectId: sub.id,
        mediumId: sub.mediumId,
        teacherId: sub.teacher?.id ?? null,
      })),
    );

    if (!parsedRes.success) {
      toast.error("Invalid data provided");
      return;
    }

    const res = await updateClassSubjectsAction(data.id, parsedRes.data);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[min(85vh,52rem)] max-h-[calc(100vh-2rem)] w-[min(64rem,calc(100vw-2rem))] max-w-none! flex-col overflow-hidden"
        >
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
                          value={subject.mediumId}
                          onValueChange={(value) => updateSubject(index, { mediumId: value })}
                        >
                          <SelectTrigger aria-invalid={!subject.mediumId} className="w-full min-w-0">
                            <SelectValue placeholder="Select a medium" className="truncate" />
                          </SelectTrigger>
                          <SelectContent>
                            {mediumOptions.map((medium) => (
                              <SelectItem key={medium.value} value={medium.value}>
                                {medium.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      <div className="flex items-center gap-3 rounded-md border px-3 py-0.5 max-w-md">
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate text-sm",
                            !subject.teacher?.fullName && "text-muted-foreground",
                          )}
                        >
                          {subject.teacher?.fullName ?? "Select subject teacher"}
                        </span>
                        {subject.teacher && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setSubjects((prev) => [
                                ...prev.map((sub) => (sub.id === subject.id ? { ...sub, teacher: null } : sub)),
                              ])
                            }
                          >
                            <XIcon />
                            Remove
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setTeacherSubjectIndex(index)}>
                          <EditIcon />
                          {subject.teacher ? "Change" : "Assign"}
                        </Button>
                      </div>

                      <TooltipButton
                        tooltip="Delete subject"
                        size="icon"
                        variant={(function () {
                          const isExistingSubject = Boolean(data?.subjects.find((s) => s.id === subject.id));
                          if (isExistingSubject) {
                            return "destructive";
                          } else {
                            return "ghost";
                          }
                        })()}
                        onClick={() => handleRequestDeleteSubject(subject.id)}
                      >
                        <Trash2Icon />
                      </TooltipButton>
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
              <DialogErrors errors={errors} />
            </div>
          </div>

          <DialogFooter className="shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (subjects.length > 0) {
                  if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
                    onOpenChange(false);
                  }
                } else {
                  onOpenChange(false);
                }
              }}
            >
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

      {isSubjectDeleting.open && (
        <AlertDialog open={isSubjectDeleting.open}>
          <AlertDialogContent className="min-w-sm">
            <AlertDialogHeader>
              <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                <AlertTriangleIcon className="size-5" />
              </div>
              <AlertDialogTitle className="text-lg font-semibold">{`Remove '${subjects.find((s) => s.id === isSubjectDeleting.id)!.name}'?`}</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this subject from this class?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDeleteSubject}>Keep Subject</AlertDialogCancel>
              <AlertDialogAction variant={"destructive"} onClick={handleConfirmDeleteSubject}>
                Remove Subject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
