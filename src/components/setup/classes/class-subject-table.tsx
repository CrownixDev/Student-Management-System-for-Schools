import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";
import { IClass } from "@/features/class";
import { getSubjectCategory } from "@/features/subjects/subject.enums";
import { CircleQuestionMarkIcon } from "lucide-react";

export default function ClassSubjectTable({ subjects }: { subjects: IClass["subjects"] }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="max-h-[70vh] overflow-auto">
        <Table className=" pb-10">
          <TableHeader className="sticky top-0 bg-muted">
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="flex items-center gap-1 justify-center">
                Students
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMarkIcon size={15} className="cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>Students enrolled in this subject for this class.</TooltipContent>
                </Tooltip>
              </TableHead>

              <TableHead>Medium</TableHead>
              <TableHead>Teacher</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell title={subject.name} className="max-w-xs truncate">
                  {subject.name}
                </TableCell>
                <TableCell>{getSubjectCategory(subject.category)}</TableCell>
                <TableCell className="font-mono text-right">{subject.studentCount}</TableCell>
                <TableCell>{subject.medium?.name ?? "-"}</TableCell>
                <TableCell className="max-w-xs truncate">{subject.teacher?.fullName ?? "-"}</TableCell>
              </TableRow>
            ))}
            {subjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
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
