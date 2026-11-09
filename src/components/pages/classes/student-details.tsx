"use client";

import { IStudent } from "@/features/students";
import { TypographyH2 } from "@/components/ui/typography";
import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { IExamByEnrollmentId } from "@/features/exams";
import { ISubjectListItem } from "@/features/subjects";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { StudentSubjectMarksChart } from "@/components/pages/classes/student-subject-marks-chart";
import { StudentSubjectProgressChart } from "@/components/pages/classes/student-subject-progress-chart";
import { useState } from "react";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/native-select";
import EmptyState from "@/components/ui/empty-state";
import { NotebookPenIcon } from "lucide-react";

export type IStudentDetailsTab = "exam" | "subject";

export default function StudentDetails({
  student,
  subjectList,
  examData,
  defaultExamId,
  defaultSubjectId,
  defaultTab,
}: {
  student: IStudent;
  subjectList: ISubjectListItem[];
  examData: IExamByEnrollmentId[];
  defaultExamId?: string;
  defaultSubjectId?: string;
  defaultTab?: IStudentDetailsTab;
}) {
  const [selectedExamId, setSelectedExamId] = useState<string | undefined>(defaultExamId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(defaultSubjectId);
  const [tab, setTab] = useState<IStudentDetailsTab>(defaultTab ?? "exam");

  const selectedSubject = subjectList.find((subject) => subject.id === selectedSubjectId) || subjectList[0];
  const selectedExam = examData.find((exam) => exam.id === selectedExamId) || examData[0];

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
        <Badge variant={student.enrollment.status === "active" ? "success" : "outline"}>
          {student.enrollment.status}
        </Badge>
      </section>

      <Separator />

      {/* Student's Personel Details */}
      <section className="grid grid-cols-2 gap-x-8 gap-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Student phone</p>
          <p className="mt-1 text-sm font-medium">{student.phone ? student.phone : "Not listed"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Date of birth</p>
          <p className="mt-1 text-sm font-medium">{student.dob?.toLocaleDateString("si-LK") ?? "Not listed"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Guardian</p>
          <p className="mt-1 text-sm font-medium">{student.guardianName ? student.guardianName : "Not Added"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Guardian phone</p>
          <p className="mt-1 text-sm font-medium">{student.guardianPhone ? student.guardianPhone : "Not Added"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-muted-foreground">Address</p>
          <p className="mt-1 text-sm font-medium">{student.address ? student.address : "Not Added"}</p>
        </div>
      </section>

      <Separator />

      {/* Student's Exam Results for current year, grade and class */}
      <section>
        <TypographyH2>Exam results</TypographyH2>
        {examData.length > 0 ? (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className={"w-full"}>
              <TabsTrigger value="exam">By Exam</TabsTrigger>
              <TabsTrigger value="subject">By Subject</TabsTrigger>
            </TabsList>

            <TabsContent value={"exam"}>
              <NativeSelect
                value={selectedExamId}
                className="w-full my-1"
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                {examData.map((exam) => (
                  <NativeSelectOption key={exam.id} value={exam.id}>
                    {exam.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {selectedExam && (
                <div>
                  <StudentSubjectMarksChart subjects={selectedExam.subjects} examName={selectedExam.name} />
                  <Table containerClassName="border rounded-md">
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead>Subject</TableHead>
                        <TableHead>Student mark</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedExam.subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell className="tabular-nums">
                            {subject.result.status === "present" ? subject.result.marks : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value={"subject"}>
              <NativeSelect
                value={selectedSubjectId}
                className="w-full my-1"
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                {subjectList.map((sub) => (
                  <NativeSelectOption key={sub.id} value={sub.id}>
                    {sub.name.length > 30 ? sub.name.substring(0, 50) + "..." : sub.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {selectedSubject &&
                (() => {
                  const subjectMarks = examData.map((exam) => {
                    return {
                      exam: { id: exam.id, name: exam.name },
                      subject: exam.subjects.filter((s) => s.id === selectedSubject.id)[0],
                    };
                  });

                  return (
                    <div>
                      <StudentSubjectProgressChart
                        subjectId={selectedSubject.id}
                        subjectName={selectedSubject.name}
                        examData={examData}
                      />
                      <Table containerClassName="border rounded-md">
                        <TableHeader>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead>Exam</TableHead>
                            <TableHead>Student mark</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subjectMarks.map((item) => (
                            <TableRow key={item.exam.id + selectedSubject.id}>
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
                    </div>
                  );
                })()}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-20">
            <EmptyState
              icon={NotebookPenIcon}
              title="No exams found"
              description="No exams added to this grade yet. "
            />
          </div>
        )}
      </section>
    </div>
  );
}
