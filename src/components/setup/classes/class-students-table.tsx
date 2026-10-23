import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import SearchInput from "@/components/ui/search-input";
import { IClass } from "@/features/class";

export default function ClassStudentsTable({ enrollments }: { enrollments: IClass["enrollments"] }) {
  return (
    <div className="flex flex-col gap-5">
      <SearchInput placeholder="Search by student name or admission number" />
      <div className="overflow-hidden rounded-md border">
        <div className="max-h-[65vh] overflow-auto">
          <Table containerClassName="overflow-visible">
            <TableHeader className="sticky top-0 z-10 bg-muted">
              <TableRow>
                <TableHead>Index</TableHead>
                <TableHead>Admission no.</TableHead>
                <TableHead>Student</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.student.id}>
                  <TableCell className="font-mono">{enrollment.classIndex}</TableCell>
                  <TableCell className="font-mono">{enrollment.student.admissionNo}</TableCell>
                  <TableCell>{enrollment.student.fullName}</TableCell>
                </TableRow>
              ))}
              {enrollments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
