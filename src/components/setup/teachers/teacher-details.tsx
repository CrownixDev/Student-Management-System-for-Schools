import { Badge } from "@/components/shadcn/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { UsersRoundIcon } from "lucide-react";
import { idCache } from "@/lib/nuqs/id";
import { Separator } from "@/components/shadcn/separator";
import { getServerCaller } from "@/lib/orpc/server-caller";
import { safe } from "@orpc/client";
import TeacherEditBtn from "./teacher-edit-btn";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";

export default async function TeacherDetails() {
  const teacherId = idCache.get("teacherId");
  const caller = await getServerCaller();

  if (!teacherId) {
    return (
      <EmptyState
        icon={UsersRoundIcon}
        title="Select a teacher"
        description="Choose a teacher from the list to see their class and subject assignments."
      />
    );
  }

  const { data: teacher, error, definedError } = await safe(caller.teacher.getById({ id: teacherId }));

  if (error) {
    return (
      <ErrorState
        noBorder
        type="normal"
        title={definedError ? error.message : "Error loading teacher details"}
        description="Failed to load teacher details. Please try selecting another one or try reloading the page."
      />
    );
  }

  return (
    <>
      <div className="overflow-y-auto mx-auto w-full max-w-5xl space-y-8 px-16 py-8">
        <section className="flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div>
              <TypographyH2 className="text-2xl">{teacher.fullName}</TypographyH2>
              <p className="mt-1 text-md text-muted-foreground">{teacher.phone ?? "Phone not listed"}</p>
              <Badge className="mt-2" variant={teacher.isActive ? "success" : "destructive"}>
                {teacher.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <TeacherEditBtn teacher={teacher} />
        </section>
        <Separator />
        <section className="space-y-3">
          <TypographyH2>
            Class teacher assignments <span className="font-mono">({teacher.classesAsClassTeacher.length})</span>
          </TypographyH2>
          {teacher.classesAsClassTeacher.length > 0 ? (
            <Table className="border rounded-md">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold text-foreground">Academic year</TableHead>
                  <TableHead className="font-semibold text-foreground">Class</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teacher.classesAsClassTeacher.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.academicYear.name}</TableCell>
                    <TableCell className="font-medium">{assignment.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <TypographyP>No class-teacher assignments</TypographyP>
          )}
        </section>
        <section className="space-y-3">
          <TypographyH2>
            Subject assignments <span className="font-mono">({teacher.subjects.length})</span>
          </TypographyH2>
          {teacher.subjects.length ? (
            <Table className="border rounded-md">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold text-foreground">Class</TableHead>
                  <TableHead className="font-semibold text-foreground">Subject</TableHead>
                  <TableHead className="font-semibold text-foreground">Medium</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teacher.subjects.map((subject, index) => (
                  <TableRow key={`${subject.class}-${subject.name}-${subject.medium ?? "no-medium"}-${index}`}>
                    <TableCell>{subject.class}</TableCell>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.medium ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <TypographyP>No subject assignments</TypographyP>
          )}
        </section>
      </div>
    </>
  );
}
