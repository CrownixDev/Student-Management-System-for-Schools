import { IStudent } from "@/features/students";
import { TypographyH2 } from "@/components/ui/typography";
import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { IExamByEnrollmentId } from "@/features/exams";
import { ISubjectListItem } from "@/features/subjects";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { StudentSubjectMarksChart } from "@/components/classes/student-subject-marks-chart";
import { StudentSubjectProgressChart } from "@/components/classes/student-subject-progress-chart";

export default function StudentDetails({
  student,
  subjectList,
  examData,
}: {
  student: IStudent;
  subjectList: ISubjectListItem[];
  examData: IExamByEnrollmentId[];
}) {
  return (
    <div className="w-full space-y-7 overflow-x-hidden px-8 py-7">
      {/* Student's School Details */}
      <section className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <TypographyH2 className="mt-1 text-2xl mb-2">{student.fullName}</TypographyH2>
          <div className="flex flex-col gap-1">
            <div className="flex gap-3">
              <p className="text-sm">Admission No:</p>
              <p className="font-mono text-sm text-muted-foreground">{student.admissionNo}</p>
            </div>
            {student.nic && (
              <div className="flex gap-3">
                <p className="text-sm">NIC:</p>
                <p className="font-mono text-sm text-muted-foreground">{student.nic}</p>
              </div>
            )}
          </div>
        </div>
        <Badge variant={student.enrollments[0].status === "active" ? "success" : "outline"}>
          {student.enrollments[0].status}
        </Badge>
      </section>

      <Separator />

      {/* Student's Personel Details */}
      <section className="grid grid-cols-2 gap-x-8 gap-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Student phone</p>
          <p className="mt-1 text-sm font-medium">{student.phone ?? "Not listed"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Date of birth</p>
          <p className="mt-1 text-sm font-medium">{student.dob?.toLocaleDateString("si-LK") ?? "Not listed"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Guardian</p>
          <p className="mt-1 text-sm font-medium">{student.guardianName ?? "Not Added"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Guardian phone</p>
          <p className="mt-1 text-sm font-medium">{student.guardianPhone ?? "Not Added"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-muted-foreground">Address</p>
          <p className="mt-1 text-sm font-medium">{student.address ?? "Not Added"}</p>
        </div>
      </section>

      <Separator />

      {/* Student's Exam Results for current year, grade and class */}
      <section className="">
        <TypographyH2>Exam results</TypographyH2>
        <Tabs>
          <TabsList className={"w-full overflow-x-auto "}>
            <TabsTrigger value="exam">By Exam</TabsTrigger>
            <TabsTrigger value="subject">By Subject</TabsTrigger>
          </TabsList>

          <TabsContent value={"exam"}>
            <Tabs>
              <TabsList className={"w-full overflow-x-auto "} variant={"line"}>
                {examData.map((exam) => (
                  <TabsTrigger key={exam.id} value={exam.id}>
                    {exam.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {examData.map((exam) => (
                <TabsContent key={exam.id} value={exam.id}>
                  {/* TODO: Showt class highst and grade highst marks when hovering on marks chart */}
                  <StudentSubjectMarksChart subjects={exam.subjects} examName={exam.name} />
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead>Subject</TableHead>
                        <TableHead>Student mark</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exam.subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell className="tabular-nums">
                            {subject.result.status === "present" ? subject.result.marks : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value={"subject"}>
            <Tabs>
              <TabsList className={"w-full overflow-x-auto "} variant={"line"}>
                {subjectList.map((subject) => (
                  <TabsTrigger key={subject.id} value={subject.id}>
                    {subject.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {subjectList.map((subject) => {
                const subjectMarks = examData.map((exam) => {
                  return {
                    exam: { id: exam.id, name: exam.name },
                    subject: exam.subjects.filter((s) => s.id === subject.id)[0],
                  };
                });
                return (
                  <TabsContent key={subject.id} value={subject.id}>
                    {/* TODO: Showt class highst and grade highst marks when hovering on marks chart */}
                    <StudentSubjectProgressChart
                      subjectId={subject.id}
                      subjectName={subject.name}
                      examData={examData}
                    />
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead>Exam</TableHead>
                          <TableHead>Student mark</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjectMarks.map((item) => (
                          <TableRow key={item.exam.id + subject.id}>
                            <TableCell>{item.exam.name}</TableCell>
                            <TableCell>
                              {item.subject?.result.status === "present" && item.subject.result.marks !== null
                                ? item.subject.result.marks
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                );
              })}
            </Tabs>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
