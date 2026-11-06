"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { IExamListItem } from "@/features/exams";
import { getSubjectCategory } from "@/features/subjects/subject.enums";
import { Badge } from "@/components/shadcn/badge";
import ExamEditBtn from "./button/exam-edit-btn";

export default function ExamCard({ exam }: { exam: IExamListItem }) {
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
          <ExamEditBtn exam={exam} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Ranking ignored</TableHead>
              <TableHead className="text-right">Pass mark</TableHead>
              <TableHead className="text-right">Maximum mark</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exam.examSubjects.map((esub) => {
              return (
                <TableRow key={esub.subject.id}>
                  <TableCell className="flex flex-col w-50">
                    <span className="truncate" title={esub.subject.name}>
                      {esub.subject.name}
                    </span>
                    {esub.subject.code && (
                      <span className="text-sm text-muted-foreground truncate">({esub.subject.code})</span>
                    )}
                  </TableCell>
                  <TableCell className="w-25">{getSubjectCategory(esub.subject.category)}</TableCell>
                  <TableCell className="text-center">
                    {esub.ignoreRanking ? (
                      <Badge variant="destructive">Yes</Badge>
                    ) : (
                      <Badge variant="success">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">{esub.passMark}</TableCell>
                  <TableCell className="text-right font-mono">{esub.maxMarks}</TableCell>
                </TableRow>
              );
            })}
            {exam.examSubjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
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
