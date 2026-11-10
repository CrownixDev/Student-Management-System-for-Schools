"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/native-select";
import { Tabs, TabsContent } from "@/components/shadcn/tabs";
import { ClipboardListIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/shadcn/field";
import { IExamListItem, TopResultClass } from "@/features/exams";
import { useState } from "react";
import StudentDetailsViewButton from "../student-details-view-button";
import EmptyState from "@/components/ui/empty-state";
import { IClassListWithSubjectsItem } from "@/features/class";

export default function ExamResultsClass({
  exam,
  classes,
  classesWithSubjects,
}: {
  exam: IExamListItem;
  classes: TopResultClass[];
  classesWithSubjects: IClassListWithSubjectsItem[];
}) {
  const [value, setValue] = useState(classes[0].id);
  return (
    <>
      <Field orientation="horizontal" className="w-fit mb-3 max-w-lg truncate">
        <FieldLabel>Class: </FieldLabel>
        <NativeSelect className="w-full" value={value} onChange={(e) => setValue(e.target.value)}>
          {classes.map((classItem) => (
            <NativeSelectOption key={classItem.id} value={classItem.id}>
              {classItem.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>

      <Tabs value={value} className="flex min-h-0 flex-1 flex-col">
        {classes.map((classItem) => {
          const subjects = classesWithSubjects.find((item) => item.id === classItem.id)?.subjects ?? [];

          return (
            <TabsContent key={classItem.id} value={classItem.id} className="min-h-0 overflow-hidden">
              {classItem.topResult.length === 0 ? (
                <EmptyState
                  icon={ClipboardListIcon}
                  title="No results available"
                  description={`There are no results available for ${classItem.name}.`}
                />
              ) : (
                <Table containerClassName="h-full overflow-auto border rounded-md">
                  <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                      <TableHead>Place</TableHead>
                      <TableHead>Class Index</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Addmission No.</TableHead>
                      {subjects.map((subject) => (
                        <TableHead title={subject.name} key={subject.id}>
                          {subject.code ?? subject.name}
                        </TableHead>
                      ))}
                      <TableHead>Full Marks</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classItem.topResult.map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{student.classIndex ? student.classIndex : "-"}</TableCell>
                        <TableCell className="max-w-50 min-w-50 whitespace-normal wrap-break-word">
                          {student.fullName}
                        </TableCell>
                        <TableCell>{student.admissionNo}</TableCell>
                        {subjects.map((subject) => {
                          const result = student.subjects.find((studentSubject) => studentSubject.id === subject.id);

                          return (
                            <TableCell key={subject.id}>
                              {result?.result.status === "absent"
                                ? "Absent"
                                : result?.result.status === "present"
                                  ? (result.result.marks ?? "-")
                                  : "-"}
                            </TableCell>
                          );
                        })}
                        <TableCell>{student.fullMarks}</TableCell>
                        <TableCell>
                          {subjects.length > 0 ? (student.fullMarks / subjects.length).toFixed(1) : "-"} %
                        </TableCell>
                        <TableCell>
                          <StudentDetailsViewButton
                            defaultExamId={exam.id}
                            studentId={student.id}
                            classId={classItem.id}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
}
