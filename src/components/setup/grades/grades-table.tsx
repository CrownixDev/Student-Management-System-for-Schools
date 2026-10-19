"use client";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { PencilIcon } from "lucide-react";
import { IGradeListItem } from "@/features/grades";

interface GradesTableProps {
  grades: IGradeListItem[];
  onEdit: (grade: IGradeListItem) => void;
}

function getGradeStage(num: number): string {
  if (num >= 1 && num <= 5) return "Primary (Grades 1-5)";
  if (num >= 6 && num <= 9) return "Junior Secondary (Grades 6-9)";
  if (num >= 10 && num <= 11) return "Ordinary Level (O/L)";
  if (num >= 12 && num <= 13) return "Advanced Level (A/L)";
  return "General";
}

export default function GradesTable({ grades, onEdit }: GradesTableProps) {
  return (
    <div className="overflow-y-scroll">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Grade</TableHead>
            <TableHead className="font-semibold">Educational Stage</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade) => {
            return (
              <TableRow key={grade.id}>
                <TableCell>{grade.name}</TableCell>

                <TableCell>{grade.number}</TableCell>

                <TableCell>
                  <Badge variant="outline" className="text-muted-foreground">
                    {getGradeStage(grade.number)}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Edit button */}
                    <Button size="icon-sm" variant="ghost" title="Edit grade" onClick={() => onEdit(grade)}>
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
