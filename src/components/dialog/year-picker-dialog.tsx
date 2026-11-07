"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Label } from "@/components/shadcn/label";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { IAcademicYear } from "@/features/academic-years";
import { getAcademicYearListAction } from "@/features/academic-years/year.actions";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, CalendarDaysIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { YEAR_LIST } from "@/lib/query-keys";
import EmptyState from "@/components/ui/empty-state";
import LoadingIndicator from "@/components/ui/loading-indicator";
import SearchInput from "@/components/ui/search-input";

export default function YearPickerDialog({
  open,
  onOpenChange,
  selectedYearId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedYearId?: string;
  onSelect: (year: IAcademicYear) => void;
}) {
  const [search, setSearch] = useState("");
  const [yearId, setYearId] = useState(selectedYearId ?? "");

  const { data: years = [], isPending } = useQuery({
    enabled: open,
    queryKey: [YEAR_LIST, search],
    queryFn: async () => {
      const result = await getAcademicYearListAction({ search: search.trim() || null });
      if (!result.success) {
        toast.error(result.message);
        throw new Error(result.message);
      }
      return result.data;
    },
  });

  function confirmSelection() {
    const year = years.find((item) => item.id === yearId);
    if (!year) return;
    onSelect(year);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex min-w-md flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Select academic year</DialogTitle>
        </DialogHeader>
        <SearchInput
          placeholder="Search academic years"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
        />
        {isPending ? (
          <LoadingIndicator />
        ) : (
          <div className="max-h-[45dvh] flex-1 overflow-y-auto rounded-md border">
            <RadioGroup value={yearId} onValueChange={setYearId}>
              {years.map((year) => (
                <div key={year.id} className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0">
                  <RadioGroupItem value={year.id} id={`year-${year.id}`} />
                  <Label className="flex-1 cursor-pointer" htmlFor={`year-${year.id}`}>
                    {year.name}
                    {year.isCurrent ? " (Current)" : ""}
                  </Label>
                  {yearId === year.id && <CheckIcon className="size-4 shrink-0 text-muted-foreground" />}
                </div>
              ))}
            </RadioGroup>
            {years.length === 0 && (
              <EmptyState
                noBorder
                icon={CalendarDaysIcon}
                title="No academic years found"
                description={search ? "Try a different search." : "There are no academic years available."}
              />
            )}
          </div>
        )}
        <DialogFooter className="shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!yearId} onClick={confirmSelection}>
            Select year
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
