import { Badge } from "@/components/shadcn/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { academicYearsService, IAcademicYear } from "@/features/academic-years";
import YearsEditBtn from "./buttons/years-edit-btn";
import YearsSetCurrentBtn from "./buttons/years-set-current-btn";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import EmptyState from "@/components/ui/empty-state";
import { CalendarsIcon } from "lucide-react";

export default async function YearsTable() {
  const search = filterCache.get("search");
  let years: IAcademicYear[] | null = null;

  try {
    years = await academicYearsService.getList({ search });
  } catch (error) {
    console.error("Failed to load academic years from service:", error);
    redirect("/setup");
  }

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
                    <Badge variant="outline">Past</Badge>
                  )}
                </TableCell>

                <TableCell className="font-mono">{year.startDate.toLocaleDateString("si-LK")}</TableCell>

                <TableCell className="font-mono">{year.endDate.toLocaleDateString("si-LK")}</TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <YearsSetCurrentBtn year={year} />
                    <YearsEditBtn year={year} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {years.length === 0 && (
        <div className="py-12">
          <EmptyState
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
    </div>
  );
}
