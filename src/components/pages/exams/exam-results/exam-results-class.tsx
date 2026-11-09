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

export default function ExamResultsClass({ exam, classes }: { exam: IExamListItem; classes: TopResultClass[] }) {
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

      <Tabs value={value} className="flex min-h-0 flex-1 flex-col border rounded-md">
        {classes.map((classItem) => (
          <TabsContent key={classItem.id} value={classItem.id} className="min-h-0 overflow-hidden">
            {classItem.topResult.length === 0 ? (
              <EmptyState
                icon={ClipboardListIcon}
                title="No results available"
                description={`There are no results available for ${classItem.name}.`}
              />
            ) : (
              <Table containerClassName="h-full overflow-auto">
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead>Place</TableHead>
                    <TableHead>Class Index</TableHead>
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
                      <TableCell>{student.classIndex ? student.classIndex : "-"}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.admissionNo}</TableCell>
                      <TableCell>{student.fullMarks}</TableCell>
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
        ))}
      </Tabs>
    </>
  );
}
