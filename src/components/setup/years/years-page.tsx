"use client";

import { Button } from "@/components/shadcn/button";
import { TypographyH1 } from "@/components/ui/typography";
import { CalendarsIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useQueryStates } from "nuqs";
import { filterParsers } from "@/lib/nuqs/filter";
import { IAcademicYear } from "@/features/academic-years";
import { Separator } from "@/components/shadcn/separator";
import YearDialog from "@/components/dialog/academic-years/year-dialog";
import YearsTable from "./years-table";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";

export default function YearsPage({ academicYears }: { academicYears: IAcademicYear[] }) {
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<IAcademicYear | null>(null);
  const [{ search }] = useQueryStates(filterParsers);

  function handleOpenAdd() {
    setEditingYear(null);
    setIsYearDialogOpen(true);
  }

  function handleOpenEdit(year: IAcademicYear) {
    setEditingYear(year);
    setIsYearDialogOpen(true);
  }

  return (
    <div className="flex flex-col overflow-y-auto p-8 space-y-6">
      <div className="flex w-full items-center justify-between gap-5">
        <TypographyH1 className="text-xl lg:text-2xl font-bold tracking-tight">Academic Years</TypographyH1>
        <Button onClick={handleOpenAdd} className="gap-1.5 shadow-xs">
          <PlusIcon className="size-4" />
          Add Academic Year
        </Button>
      </div>

      <SearchInput placeholder="Search academic years..." />

      <Separator />

      {academicYears.length > 0 ? (
        <YearsTable years={academicYears} onEdit={handleOpenEdit} />
      ) : (
        <div className="py-12 border border-dashed rounded-xl border-border bg-card/40">
          <EmptyState
            noBorder
            icon={CalendarsIcon}
            title={search ? "No matching academic years" : "No academic years found"}
            description={
              search
                ? `No academic years match "${search}". Try searching for another year.`
                : "Get started by adding the first academic year."
            }
          />
        </div>
      )}

      {/* Add / Edit Academic Year Dialog */}
      {isYearDialogOpen && <YearDialog open={isYearDialogOpen} onOpenChange={setIsYearDialogOpen} data={editingYear} />}
    </div>
  );
}
