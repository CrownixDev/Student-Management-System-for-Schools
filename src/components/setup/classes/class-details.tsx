import { BookOpenIcon, GraduationCapIcon, UsersIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import { classService, IClass } from "@/features/class";
import { TypographyH1 } from "@/components/ui/typography";
import { Separator } from "@/components/shadcn/separator";
import { idCache } from "@/lib/nuqs/id";
import EmptyState from "@/components/ui/empty-state";
import ClassEditBtn from "./buttons/class-edit-btn";
import ClassStudentsTable from "./class-students-table";
import ClassSubjectTable from "./class-subject-table";
import ClassStudentAddBtn from "./buttons/class-student-add-btn";
import { redirect } from "next/navigation";
import ClassSubjectAddBtn from "./buttons/class-subjects-add--btn";

export default async function ClassDetails() {
  const classId = idCache.get("classId");

  let classData: IClass | null = null;

  try {
    if (classId) classData = await classService.getById(classId);
  } catch (error) {
    console.log("Error fetching class data:", error);
    redirect("/setup/classes", "replace");
  }

  if (!classData) {
    return (
      <EmptyState
        icon={GraduationCapIcon}
        title="Select a class"
        description="Choose a class from the grades list to view its subjects and students."
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
                <TableCell>{classData.academicYear.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Grade</TableCell>
                <TableCell>{classData.gradeLevel.name}</TableCell>
              </TableRow>
              {classData.batch && (
                <TableRow>
                  <TableCell className="font-medium">Batch</TableCell>
                  <TableCell>{classData.batch.name}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className="font-medium">Class Teacher</TableCell>
                <TableCell>{classData.classTeacher?.fullName ?? "No class teacher assigned"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Medium</TableCell>
                <TableCell>{classData.defaultMedium ? `${classData.defaultMedium.name} medium` : ""}</TableCell>
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
