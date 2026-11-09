"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/native-select";
import { IExamListItem, TopResultSubject } from "@/features/exams";
import { Tabs, TabsContent } from "@/components/shadcn/tabs";
import { ClipboardListIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/shadcn/field";
import { useState } from "react";
import StudentDetailsViewButton from "../student-details-view-button";
import EmptyState from "@/components/ui/empty-state";

export default function ExamResultsSubjects({ exam, subjects }: { exam: IExamListItem; subjects: TopResultSubject[] }) {
  const [value, setValue] = useState(subjects[0].id);
  return (
    <>
      <Field orientation="horizontal" className="w-fit mb-3 max-w-lg truncate">
        <FieldLabel>Class: </FieldLabel>
        <NativeSelect className="w-full" value={value} onChange={(e) => setValue(e.target.value)}>
          {subjects.map((classItem) => (
            <NativeSelectOption key={classItem.id} value={classItem.id}>
              {classItem.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>

      <Tabs value={value} className="flex min-h-0 flex-1 flex-col border rounded-md">
        {subjects.map((subject) => (
          <TabsContent key={subject.id} value={subject.id} className="min-h-0 overflow-hidden">
            {subject.topResult.length === 0 ? (
              <EmptyState
                icon={ClipboardListIcon}
                title="No results available"
                description={`There are no results available for ${subject.name}.`}
              />
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
                          classId={student.class.id}
                          defaultExamId={exam.id}
                          defaultSubjectId={subject.id}
                          defaultTab="subject"
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
    </>
  );
}
