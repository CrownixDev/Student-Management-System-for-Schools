import { BookOpenIcon, GraduationCapIcon, UsersIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import { TypographyH1 } from "@/components/ui/typography";
import { Separator } from "@/components/shadcn/separator";
import { idCache } from "@/lib/nuqs/id";
import { getServerCaller } from "@/lib/orpc/server-caller";
import { safe } from "@orpc/client";
import ClassStudentsTable from "./class-students-table";
import ClassStudentAddBtn from "./buttons/class-student-add-btn";
import ClassSubjectAddBtn from "./buttons/class-subjects-add-btn";
import ClassSubjectTable from "./class-subject-table";
import ClassEditBtn from "./buttons/class-edit-btn";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";

export default async function ClassDetails() {
  const classId = idCache.get("classId");
  const caller = await getServerCaller();

  if (!classId) {
    return (
      <EmptyState
        icon={GraduationCapIcon}
        title="Select a class"
        description="Choose a class from the grades list to view its subjects and students."
      />
    );
  }

  const { data: classData, error, definedError } = await safe(caller.class.getById({ id: classId }));

  if (error) {
    return (
      <ErrorState
        noBorder
        type="normal"
        title={definedError ? error.message : "Error loading class data"}
        description="Failed to load class data. Please try selecting another class or try reloading the page."
      />
    );
  }

  return (
    <main className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl space-y-6 py-8 px-10">
        <header className="flex justify-between gap-4 flex-row items-start">
          <TypographyH1>{classData.name}</TypographyH1>
          <div className="flex shrink-0 gap-2">
            <ClassEditBtn classData={classData} />
            <ClassSubjectAddBtn classData={classData} />
            <ClassStudentAddBtn classData={classData} />
          </div>
        </header>

        <section>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Year</TableCell>
                <TableCell>{classData.gradeLevel.academicYear.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Grade</TableCell>
                <TableCell>{classData.gradeLevel.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Batch</TableCell>
                <TableCell>{classData.gradeLevel.batch?.name ?? "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Class Teacher</TableCell>
                <TableCell>{classData.teacher?.fullName ?? "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        <Separator />

        <Tabs defaultValue="subjects" className="w-full">
          <TabsList>
            <TabsTrigger value="subjects">
              <BookOpenIcon />
              Subjects <span className="font-mono">({classData.subjects.length})</span>
            </TabsTrigger>
            <TabsTrigger value="students">
              <UsersIcon />
              Students <span className="font-mono">({classData.enrollments.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subjects">
            <ClassSubjectTable subjects={classData.subjects} />
          </TabsContent>

          <TabsContent value="students">
            <ClassStudentsTable enrollments={classData.enrollments} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
