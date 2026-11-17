"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { IExamListItem, TopResultClass } from "@/features/exams";
import { IClassListWithSubjectsItem } from "@/features/class";
import { Tabs, TabsContent } from "@/components/shadcn/tabs";
import { ClipboardListIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/shadcn/field";
import { useState } from "react";
import StudentDetailsViewButton from "../student-details-view-button";
import EmptyState from "@/components/ui/empty-state";

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
        <Select
          items={classes.map((cls) => ({ value: cls.id, label: cls.name }))}
          value={value}
          onValueChange={(value) => (value ? setValue(value) : undefined)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {classes.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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
                    {classItem.topResult.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="text-right">{student.place}</TableCell>
                        <TableCell className="text-right">{student.classIndex ? student.classIndex : "-"}</TableCell>
                        <TableCell className="max-w-50 min-w-50 whitespace-normal wrap-break-word">
                          {student.fullName}
                        </TableCell>
                        <TableCell>{student.admissionNo}</TableCell>
                        {subjects.map((subject) => {
                          const result = student.subjects.find((studentSubject) => studentSubject.id === subject.id);

                          return (
                            <TableCell key={subject.id} className="text-right">
                              {result?.result.status === "absent"
                                ? "Absent"
                                : result?.result.status === "present"
                                  ? (result.result.marks ?? "-")
                                  : "-"}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right">{student.fullMarks}</TableCell>
                        <TableCell className="text-right">
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
