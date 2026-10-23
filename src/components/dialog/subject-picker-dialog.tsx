"use client";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { subjectCategories } from "@/features/subjects/subject.enums";
import { SubjectCategory } from "@/generated/prisma/enums";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SUBJECT_LIST } from "@/lib/query-keys";
import { getSubjectListAction } from "@/features/subjects/subject.actions";
import { toast } from "react-toastify";
import { Field, FieldLabel } from "../shadcn/field";
import { Badge } from "../shadcn/badge";
import PageLoading from "../ui/page-loading";
import { LibraryBigIcon, Loader2Icon } from "lucide-react";
import EmptyState from "../ui/empty-state";
import SearchInput from "../ui/search-input";
import { ISubjectListItem } from "@/features/subjects";

export default function SubjectPickerDialog({
  open,
  onOpenChange,
  selectedSubjectIds,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSubjectIds: string[];
  onAdd: (subjectList: ISubjectListItem[]) => void;
}) {
  const [category, setcategory] = useState<SubjectCategory>(subjectCategories[0].value);
  const [selectedSubjects, setSelectedSubjects] = useState<ISubjectListItem[]>([]);
  const [search, setSearch] = useState("");
  const selectedIds = selectedSubjects.map((subject) => subject.id);

  const {
    data: subjects = [],
    isPending,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      const res = await getSubjectListAction({ search, category });
      if (res.success) {
        return res.data;
      } else {
        toast.error(res.message);
        throw new Error(res.message);
      }
    },
    queryKey: [SUBJECT_LIST, category, search],
  });

  const availableSubjects = subjects.filter((subject) => !selectedSubjectIds.includes(subject.id));

  function toggleSubject(subjectId: string, checked: boolean) {
    const subject = subjects.find((item) => item.id === subjectId);
    setSelectedSubjects((current) => {
      if (selectedSubjectIds.includes(subjectId)) {
        return current;
      }

      if (!checked) {
        return current.filter((item) => item.id !== subjectId);
      }

      return subject && !current.some((item) => item.id === subjectId) ? [...current, subject] : current;
    });
  }

  function toggleAll(checked: boolean) {
    setSelectedSubjects((current) => {
      const availableIds = new Set(availableSubjects.map((subject) => subject.id));
      const otherSelections = current.filter((subject) => !availableIds.has(subject.id));
      return checked ? [...otherSelections, ...availableSubjects] : otherSelections;
    });
  }

  function addSelected() {
    onAdd(selectedSubjects.filter((subject) => !selectedSubjectIds.includes(subject.id)));
    setSelectedSubjects([]);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Add subjects to class</DialogTitle>
        </DialogHeader>

        <SearchInput value={search} onChange={setSearch} placeholder="Search for a subject" />

        <Tabs
          value={category}
          onValueChange={(value) => setcategory(value as SubjectCategory)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="overflow-x-auto">
            <TabsList className="min-w-full justify-start">
              {subjectCategories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {subjectCategories.map((category) => (
            <TabsContent key={category.value} value={category.value} className="mt-3 min-h-0 flex-1">
              <Field orientation={"horizontal"}>
                <FieldLabel className="text-muted-foreground">
                  {availableSubjects.length} available - {selectedIds.length} selected
                  {!isPending && isFetching && <Loader2Icon size={15} className="animate-spin" />}
                </FieldLabel>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={availableSubjects.length === 0}
                  onClick={() => toggleAll(!availableSubjects.every((subject) => selectedIds.includes(subject.id)))}
                >
                  {availableSubjects.length > 0 &&
                  availableSubjects.every((subject) => selectedIds.includes(subject.id))
                    ? "Clear category"
                    : "Select all"}
                </Button>
              </Field>

              <ScrollArea className="h-[min(40vh,28rem)] rounded-md border">
                <div className="divide-y">
                  {!isPending &&
                    subjects.length > 0 &&
                    subjects.map((subject) => {
                      const alreadyAssigned = selectedSubjectIds.includes(subject.id);
                      return (
                        <Field
                          key={subject.id}
                          orientation="horizontal"
                          className={`flex items-center gap-3 px-3 py-2.5 ${
                            alreadyAssigned ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                          }`}
                        >
                          <Checkbox
                            id={subject.id}
                            checked={alreadyAssigned || selectedIds.includes(subject.id)}
                            disabled={alreadyAssigned}
                            onCheckedChange={(checked) => toggleSubject(subject.id, checked === true)}
                          />
                          <FieldLabel htmlFor={subject.id} className="flex w-full justify-between cursor-pointer">
                            <span>{subject.name}</span>
                            {alreadyAssigned && <Badge variant={"outline"}>Added</Badge>}
                            {subject.code && <span className="text-xs text-muted-foreground">{subject.code}</span>}
                          </FieldLabel>
                        </Field>
                      );
                    })}
                  {!isPending && subjects.length === 0 && (
                    <EmptyState
                      noBorder
                      icon={LibraryBigIcon}
                      title="No subjects available"
                      description="There are no subjects available for this category."
                    />
                  )}
                  {isPending && <PageLoading />}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter className="shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={addSelected} disabled={selectedIds.length === 0}>
            Add {selectedIds.length ? `${selectedIds.length} ` : ""}subject
            {selectedIds.length === 1 ? "" : "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
