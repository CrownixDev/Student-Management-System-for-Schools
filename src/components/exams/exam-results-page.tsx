import { Separator } from "@/components/shadcn/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { IExamListItem, IExamTopResults } from "@/features/exams";
import { ClipboardListIcon } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import StudentDetailsViewButton from "./student-details-view-button";

function ResultsEmptyState({
  description = "There are no results available for this selection.",
}: {
  description?: string;
}) {
  return <EmptyState icon={ClipboardListIcon} title="No results available" description={description} />;
}

export default function ExamResults({ details, results }: { details: IExamListItem; results: IExamTopResults }) {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden p-5">
      <div className="flex shrink-0 items-center gap-3 p-3">
        <TypographyH1>{details.name} Results</TypographyH1>
        <TypographyP>({details.academicYear.name})</TypographyP>
      </div>
      <Separator className="shrink-0" />
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Tabs className="flex min-h-0 flex-1 flex-col">
          <TabsList className="w-full shrink-0">
            <TabsTrigger value="grade">By Grade</TabsTrigger>
            <TabsTrigger value="class">By Class</TabsTrigger>
            <TabsTrigger value="subject">By Subject</TabsTrigger>
          </TabsList>
          <TabsContent value="grade" className="min-h-0 overflow-hidden">
            {results.byGrade.length === 0 ? (
              <ResultsEmptyState />
            ) : (
              <Table containerClassName="h-full overflow-auto">
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead>Place</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Addmission No.</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Full Marks</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.byGrade.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.admissionNo}</TableCell>
                      <TableCell>{student.class.name}</TableCell>
                      <TableCell>{student.fullMarks}</TableCell>
                      <TableCell>
                        <StudentDetailsViewButton
                          studentId={student.id}
                          yearId={details.academicYear.id}
                          gradeId={details.gradeLevel.id}
                          classId={student.class.id}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          <TabsContent value="class" className="flex min-h-0 flex-col overflow-hidden">
            {results.byClass.length === 0 ? (
              <ResultsEmptyState description="There are no class results available for this exam." />
            ) : (
              <Tabs className="flex min-h-0 flex-1 flex-col">
                <TabsList variant="line" className="w-full shrink-0">
                  {results.byClass.map((classItem) => (
                    <TabsTrigger key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {results.byClass.map((classItem) => (
                  <TabsContent key={classItem.id} value={classItem.id} className="min-h-0 overflow-hidden">
                    {classItem.topResult.length === 0 ? (
                      <ResultsEmptyState description={`There are no results available for ${classItem.name}.`} />
                    ) : (
                      <Table containerClassName="h-full overflow-auto">
                        <TableHeader className="sticky top-0 z-10 bg-background">
                          <TableRow>
                            <TableHead>Place</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Addmission No.</TableHead>
                            <TableHead>Full Marks</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classItem.topResult.map((student, index) => (
                            <TableRow key={student.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{student.fullName}</TableCell>
                              <TableCell>{student.admissionNo}</TableCell>
                              <TableCell>{student.fullMarks}</TableCell>
                              <TableCell>
                                <StudentDetailsViewButton
                                  studentId={student.id}
                                  yearId={details.academicYear.id}
                                  gradeId={details.gradeLevel.id}
                                  classId={classItem.id}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </TabsContent>
          <TabsContent value="subject" className="flex min-h-0 flex-col overflow-hidden">
            {results.bySubject.length === 0 ? (
              <ResultsEmptyState description="There are no subject results available for this exam." />
            ) : (
              <Tabs className="flex min-h-0 flex-1 flex-col">
                <TabsList variant="line" className="w-full shrink-0">
                  {results.bySubject.map((subject) => (
                    <TabsTrigger key={subject.id} value={subject.id}>
                      {subject.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {results.bySubject.map((subject) => (
                  <TabsContent key={subject.id} value={subject.id} className="min-h-0 overflow-hidden">
                    {subject.topResult.length === 0 ? (
                      <ResultsEmptyState description={`There are no results available for ${subject.name}.`} />
                    ) : (
                      <Table containerClassName="h-full overflow-auto">
                        <TableHeader className="sticky top-0 z-10 bg-background">
                          <TableRow>
                            <TableHead>Place</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Addmission No.</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Full Marks</TableHead>
                            <TableHead>Medium</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subject.topResult.map((student, index) => (
                            <TableRow key={student.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{student.fullName}</TableCell>
                              <TableCell>{student.admissionNo}</TableCell>
                              <TableCell>{student.class.name}</TableCell>
                              <TableCell>{student.status === "present" ? student.fullMarks : "Absent"}</TableCell>
                              <TableCell>{student.medium}</TableCell>
                              <TableCell>
                                <StudentDetailsViewButton
                                  studentId={student.id}
                                  yearId={details.academicYear.id}
                                  gradeId={details.gradeLevel.id}
                                  classId={student.class.id}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
