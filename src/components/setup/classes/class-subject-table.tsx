import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { IClass } from "@/features/class";

export default function ClassSubjectTable({ subjects }: { subjects: IClass["subjects"] }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="max-h-[70vh] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-muted">
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead>Teacher</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell className="capitalize">{subject.category.replaceAll("_", " ")}</TableCell>
                <TableCell>{subject.medium?.name ?? "Not specified"}</TableCell>
                <TableCell>{subject.teacher.fullName}</TableCell>
              </TableRow>
            ))}
            {subjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No subjects assigned to this class.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
