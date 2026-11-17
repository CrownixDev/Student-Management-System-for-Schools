"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { IExamListItem, IExamTopResults } from "@/features/exams";
import { Tabs, TabsContent } from "@/components/shadcn/tabs";
import { ClipboardListIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/shadcn/field";
import { useState } from "react";
import StudentDetailsViewButton from "../student-details-view-button";
import EmptyState from "@/components/ui/empty-state";

export default function ExamResultsSubjects({ exam, results }: { exam: IExamListItem; results: IExamTopResults }) {
  const [value, setValue] = useState(results.bySubject[0].id);

  const classOptions = [
    { value: "all", label: "All" },
    ...results.byClass.map((cls) => ({ value: cls.id, label: cls.name })),
  ];
  const [classValue, setClassValue] = useState<string>("all");

  return (
    <>
      <Field orientation="horizontal">
        <Field orientation="horizontal" className="w-fit mb-3 max-w-lg truncate">
          <FieldLabel>Class: </FieldLabel>

          <Select
            items={classOptions}
            value={classValue}
            onValueChange={(value) => (value ? setClassValue(value) : undefined)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {classOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field orientation="horizontal" className="w-fit mb-3 max-w-lg truncate">
          <FieldLabel>Subject: </FieldLabel>

          <Select
            items={results.bySubject.map((sub) => ({ value: sub.id, label: sub.name }))}
            value={value}
            onValueChange={(value) => (value ? setValue(value) : undefined)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {results.bySubject.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </Field>

      <Tabs value={value} className="flex min-h-0 flex-1 flex-col border rounded-md">
        {results.bySubject.map((subject) => {
          let filteredStudents = subject.topResult;

          if (classValue !== "all") {
            filteredStudents = subject.topResult.filter((res) => res.class.id === classValue);
          }

          const rankedResults = function getRankedResult() {
            let prevMarks: number | null = null;
            let prevPlace = 0;
            let currentPlace = 0;

            return filteredStudents.map((student) => {
              currentPlace += 1;

              // if marks equel to previous student, both should get the same place
              if (student.fullMarks === prevMarks) {
                return { place: prevPlace, ...student };
              } else {
                prevMarks = student.fullMarks;
                prevPlace = currentPlace;
                return { place: currentPlace, ...student };
              }
            });
          };

          return (
            <TabsContent key={subject.id} value={subject.id} className="min-h-0 overflow-hidden">
              {filteredStudents.length === 0 ? (
                <EmptyState
                  icon={ClipboardListIcon}
                  title="No results available"
                  description={`There are no results available for ${subject.name}.`}
                />
              ) : (
                <Table containerClassName="h-full overflow-auto border rounded-md">
                  <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                      <TableHead>Place</TableHead>
                      {classValue !== "all" && <TableHead>Class Index</TableHead>}
                      <TableHead>Full Name</TableHead>
                      <TableHead>Addmission No.</TableHead>
                      {classValue === "all" && <TableHead>Class</TableHead>}
                      <TableHead>Full Marks</TableHead>
                      <TableHead>Medium</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankedResults().map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="text-right">{student.place}</TableCell>
                        {classValue !== "all" && <TableCell className="text-right">{student.classIndex}</TableCell>}
                        <TableCell className="max-w-50 min-w-50 whitespace-normal wrap-break-word">
                          {student.fullName}
                        </TableCell>
                        <TableCell>{student.admissionNo}</TableCell>
                        {classValue === "all" && <TableCell>{student.class.name}</TableCell>}
                        <TableCell className="text-right">
                          {student.status === "present" ? student.fullMarks : "Absent"}
                        </TableCell>
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
          );
        })}
      </Tabs>
    </>
  );
}
