import { Badge } from "@/components/shadcn/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { gradesService, IGradeListItem } from "@/features/grades";
import GradesEditBtn from "./buttons/grades-edit-btn";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import EmptyState from "@/components/ui/empty-state";
import { GraduationCapIcon } from "lucide-react";

function getGradeStage(num: number): string {
  if (num >= 1 && num <= 5) return "Primary (Grades 1-5)";
  if (num >= 6 && num <= 9) return "Junior Secondary (Grades 6-9)";
  if (num >= 10 && num <= 11) return "Ordinary Level (O/L)";
  if (num >= 12 && num <= 13) return "Advanced Level (A/L)";
  return "Other";
}

export default async function GradesTable() {
  let grades: IGradeListItem[] | null = null;
  const search = filterCache.get("search");

  try {
    grades = await gradesService.getList({ search });
  } catch (error) {
    console.error("Failed to load grades from service:", error);
    redirect("/setup");
  }

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
                  <GradesEditBtn grade={grade} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {grades.length === 0 && (
        <div className="py-12">
          <EmptyState
            icon={GraduationCapIcon}
            title={search ? "No matching grades" : "No grades found"}
            description={
              search
                ? `No grades match "${search}". Try searching for another grade.`
                : "Get started by adding a grade."
            }
          />
        </div>
      )}
    </div>
  );
}
