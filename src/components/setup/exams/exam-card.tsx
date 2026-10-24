"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { IExamListItem } from "@/features/exams";
import { subjectCategories } from "@/features/subjects/subject.enums";
import ExamEditBtn from "./button/exam-edit-btn";
import { IGradeListItem } from "@/features/grades";
import { IAcademicYear } from "@/features/academic-years";

export interface ExamCardProps {
  year: IAcademicYear;
  grade: IGradeListItem;
  exam: IExamListItem;
}

export default function ExamCard({ year, grade, exam }: ExamCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="min-w-0">
          <CardTitle className="truncate">{exam.name}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {exam.examSubjects.length} {exam.examSubjects.length === 1 ? "subject" : "subjects"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ExamEditBtn year={year} grade={grade} exam={exam} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Pass mark</TableHead>
              <TableHead className="text-right">Maximum mark</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exam.examSubjects.map((subject) => {
              const category = subjectCategories.find((cat) => cat.value === subject.category);
              return (
                <TableRow key={subject.id}>
                  <TableCell>
                    {subject.name}
                    {subject.code && <span className="ml-2 text-sm text-muted-foreground">({subject.code})</span>}
                  </TableCell>
                  <TableCell>{category?.label ?? "Other"}</TableCell>
                  <TableCell className="text-right tabular-nums font-mono">{subject.passMark}</TableCell>
                  <TableCell className="text-right tabular-nums font-mono">{subject.maxMarks}</TableCell>
                </TableRow>
              );
            })}
            {exam.examSubjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No subjects added.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
