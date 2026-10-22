"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { CheckIcon, UserRoundXIcon } from "lucide-react";
import { useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTeachersListAction } from "@/features/teachers/teachers.actions";
import { TEACHERS_LIST } from "@/lib/query-keys";
import { toast } from "react-toastify";
import PageLoading from "@/components/ui/page-loading";
import EmptyState from "@/components/ui/empty-state";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { Label } from "@/components/shadcn/label";
import { RESULT_LIMIT } from "@/constraints";
import SearchInput from "../ui/search-input";
import DialogPagination from "../ui/dialog/dialog-pagination";

export default function TeacherPickerDialog({
  open,
  onOpenChange,
  selectedTeacherId,
  onSelect,
  title = "Select a teacher",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (teacherId: string) => void;
  selectedTeacherId?: string;
  title?: string;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [teacherId, setTeacherId] = useState<string | null>(selectedTeacherId ?? null);
  const teacherList = useRef<HTMLDivElement>(null);

  // Fetching teachers list
  const {
    data = { count: 0, list: [] },
    isPending,
    isPlaceholderData,
  } = useQuery({
    enabled: open,
    queryFn: async () => {
      const res = await getTeachersListAction({ search: search.trim(), page, limit: RESULT_LIMIT });
      if (res.success) {
        return res.data;
      } else {
        toast.error(res.message);
        throw new Error(res.message);
      }
    },
    placeholderData: keepPreviousData,
    queryKey: [TEACHERS_LIST, page, search],
  });

  function confirmSelection() {
    if (teacherId) {
      onSelect(teacherId);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex  flex-col overflow-hidden min-w-md">
        <DialogHeader className="shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <SearchInput
          placeholder="Search teachers"
          value={search}
          onChange={(search) => {
            setSearch(search);
            setPage(1);
          }}
          onClear={() => setSearch("")}
        />

        {isPending && <PageLoading />}

        {!isPending && (
          <div ref={teacherList} className="min-h-[35dvh] max-h-[35dvh]  flex-1  overflow-y-auto rounded-md border">
            <RadioGroup defaultValue={selectedTeacherId} onValueChange={(value) => setTeacherId(value)}>
              {data.list.map((teacher) => (
                <div key={teacher.id} className="flex w-full justify-between items-center gap-3 px-3 py-2.5">
                  <div className="flex w-full items-center gap-3 cursor-pointer">
                    <RadioGroupItem value={teacher.id} id={teacher.id} />
                    <Label className="w-full cursor-pointer" htmlFor={teacher.id}>
                      {teacher.fullName}
                    </Label>
                  </div>
                  {teacherId === teacher.id && <CheckIcon className="size-4 shrink-0 text-muted-foreground" />}
                </div>
              ))}
            </RadioGroup>
            {data.list.length === 0 && (
              <EmptyState
                noBorder
                icon={UserRoundXIcon}
                title="No teachers found"
                description={
                  search
                    ? `No teachers match your search criteria for "${search}".`
                    : "There are no teachers available."
                }
              />
            )}
          </div>
        )}

        <DialogPagination
          itemCount={data.count}
          page={page}
          onPageChange={setPage}
          disable={{ next: isPlaceholderData }}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={confirmSelection} disabled={!teacherId}>
            Select teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
