"use client";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { CheckCircle2Icon, PencilIcon, } from "lucide-react";
import { IAcademicYear } from "@/features/academic-years";
import SetAsCurrentYearDialog from "@/components/dialog/academic-years/set-as-current-year-dialog";

interface YearsTableProps {
  years: IAcademicYear[];
  onEdit: (year: IAcademicYear) => void;
}

export default function YearsTable({ years, onEdit }: YearsTableProps) {
  return (
    <div className="overflow-y-scroll">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-semibold text-foreground">Academic Year</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
            <TableHead className="font-semibold text-foreground">Start Date</TableHead>
            <TableHead className="font-semibold text-foreground">End Date</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {years.map((year) => {
            return (
              <TableRow key={year.id} className={year.isCurrent ? "bg-muted/20" : undefined}>
                <TableCell>{year.name}</TableCell>

                <TableCell>
                  {year.isCurrent ? (
                    <Badge variant="success">Current Active Year</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </TableCell>

                <TableCell className="font-mono">{year.startDate.toLocaleDateString("si-LK")}</TableCell>

                <TableCell className="font-mono">{year.endDate.toLocaleDateString("si-LK")}</TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Set as current button */}
                    {year.isCurrent ? (
                      <Button size="sm" variant="ghost" disabled>
                        <CheckCircle2Icon />
                        Active
                      </Button>
                    ) : (
                      <SetAsCurrentYearDialog year={year} />
                    )}

                    {/* Edit button */}
                    <Button size="icon-sm" variant="ghost" title="Edit academic year" onClick={() => onEdit(year)}>
                      <PencilIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
