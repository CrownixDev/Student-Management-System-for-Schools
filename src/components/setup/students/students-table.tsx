import { studentsService } from "@/features/students";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import { CircleUserIcon } from "lucide-react";
import { Badge } from "@/components/shadcn/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { studentFilterCach } from "@/features/students/student.cache";
import { getHtmlDateString } from "@/lib/utils";
import { PageLayoutContent, PageLayoutFooter } from "@/components/ui/page/page-layout";
import EmptyState from "@/components/ui/empty-state";
import StudentsEditBtn from "./buttons/students-edit-btn";
import PagePagination from "@/components/ui/page/page-pagination";
import StudentsEnrollmentsBtn from "./buttons/students-enrollments-btn";

export default async function StudentsTable() {
  const { search, page, limit } = filterCache.all();
  const { gender, dobFrom, dobTo } = studentFilterCach.all();

  let students;

  try {
    students = await studentsService.getProfileList({ search, page, limit, gender, dobFrom, dobTo });
  } catch (error) {
    console.error("Failed to load students from service:", error);
    redirect("/setup");
  }

  return (
    <>
      <PageLayoutContent className="flex flex-col py-5">
        <div className="flex-1 border rounded-lg overflow-auto">
          <Table className="min-w-[760px]" containerClassName="!overflow-visible">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 z-10 bg-background font-semibold text-foreground">
                  Admission No.
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background font-semibold text-foreground">
                  Student Name
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background font-semibold text-foreground">
                  Date of Birth
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background font-semibold text-foreground">Phone</TableHead>
                <TableHead className="sticky top-0 z-10 bg-background font-semibold text-foreground">NIC</TableHead>
                <TableHead className="sticky top-0 z-10 bg-background font-semibold text-foreground select-none">
                  Status
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background text-right font-semibold text-foreground select-none">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.list.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono select-all">{student.admissionNo}</TableCell>
                  <TableCell className="w-72 max-w-72 whitespace-normal wrap-break-word">{student.fullName}</TableCell>
                  <TableCell>{student.dob ? getHtmlDateString(student.dob) : "-"}</TableCell>
                  <TableCell className="select-all">{student.phone || "-"}</TableCell>
                  <TableCell className="select-all">{student.nic || "-"}</TableCell>
                  <TableCell className="select-none">
                    {student.status === "active" ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Left</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right select-none flex items-center justify-end gap-1.5">
                    <StudentsEditBtn student={student} />
                    <StudentsEnrollmentsBtn student={student} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {students.list.length === 0 && (
            <div className="py-12">
              <EmptyState
                icon={CircleUserIcon}
                title={search ? "No matching students" : "No students found"}
                description={
                  search
                    ? `No students match "${search}". Try searching for another student.`
                    : "There are no active students to display."
                }
              />
            </div>
          )}
        </div>
      </PageLayoutContent>
      <PageLayoutFooter>
        <PagePagination itemCount={students.count} />
      </PageLayoutFooter>
    </>
  );
}
