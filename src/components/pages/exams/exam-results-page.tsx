import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { examService, IExamListItem, IExamTopResults } from "@/features/exams";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { ClipboardListIcon } from "lucide-react";
import { Separator } from "@/components/shadcn/separator";
import { Suspense } from "react";
import StudentDetailsViewButton from "./student-details-view-button";
import ExamResultsSubjects from "./exam-results/exam-results-subject";
import ExamResultsClass from "./exam-results/exam-results-class";
import LoadingIndicator from "@/components/ui/loading-indicator";
import EmptyState from "@/components/ui/empty-state";

async function ResultsContent({ exam }: { exam: IExamListItem }) {
  let results: IExamTopResults | null = null;

  try {
    results = await examService.getTopResults(exam.gradeLevel.id, exam.id);
  } catch {
    return (
      <EmptyState icon={ClipboardListIcon} title="No results available" description={"Could not get exam results"} />
    );
  }

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col">
      <TabsList className="w-full shrink-0">
        <TabsTrigger value="grade">By Grade</TabsTrigger>
        <TabsTrigger value="class">By Class</TabsTrigger>
        <TabsTrigger value="subject">By Subject</TabsTrigger>
      </TabsList>
      <TabsContent value="grade" className="min-h-0 overflow-hidden">
        {results.byGrade.length === 0 ? (
          <EmptyState
            icon={ClipboardListIcon}
            title="No results available"
            description={"There are no results available for this selection."}
          />
        ) : (
          <Table containerClassName="h-full overflow-auto border rounded-md">
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
                      classId={student.class.id}
                      defaultExamId={exam.id}
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
          <EmptyState
            icon={ClipboardListIcon}
            title="No results available"
            description={"There are no class results available for this exam."}
          />
        ) : (
          <ExamResultsClass classes={results.byClass} exam={exam} />
        )}
      </TabsContent>
      <TabsContent value="subject" className="flex min-h-0 flex-col overflow-hidden">
        {results.bySubject.length === 0 ? (
          <EmptyState
            icon={ClipboardListIcon}
            title="No results available"
            description={"There are no subject results available for this exam."}
          />
        ) : (
          <ExamResultsSubjects subjects={results.bySubject} exam={exam} />
        )}
      </TabsContent>
    </Tabs>
  );
}

export default function ExamResults({ exam }: { exam: IExamListItem }) {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden p-5">
      <div className="flex shrink-0 items-center gap-3 p-3">
        <TypographyH1>{exam.name} Results</TypographyH1>
        <TypographyP>({exam.gradeLevel.academicYear.name})</TypographyP>
      </div>
      <Separator className="shrink-0" />
      <section key={exam.id} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<LoadingIndicator />}>
          <ResultsContent exam={exam} />
        </Suspense>
      </section>
    </div>
  );
}
