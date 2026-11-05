import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { gradesService, IGradeListItem } from "@/features/grades";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import { GraduationCapIcon } from "lucide-react";
import { PageLayoutContent, PageLayoutFooter } from "@/components/ui/page/page-layout";
import EmptyState from "@/components/ui/empty-state";
import PagePagination from "@/components/ui/page/page-pagination";
import GradesEditBtn from "./buttons/grades-edit-btn";
import { IAcademicYear } from "@/features/academic-years";

export default async function GradesContent({ year }: { year: IAcademicYear }) {
  let grades: IGradeListItem[] | null = null;
  const search = filterCache.get("search");

  try {
    grades = await gradesService.getListByYear({ yearId: year.id, search });
  } catch (error) {
    console.error("Failed to load grades from service:", error);
    redirect("/setup");
  }

  return (
    <>
      <PageLayoutContent className="flex overflow-hidden py-5">
        <div className="flex-1 border rounded-lg overflow-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => {
                return (
                  <TableRow key={grade.id}>
                    <TableCell>{grade.name}</TableCell>

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
      </PageLayoutContent>
      <PageLayoutFooter>
        <PagePagination itemCount={grades.length} />
      </PageLayoutFooter>
    </>
  );
}
