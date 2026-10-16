import { examService, IExamClassData, IExamListItem, IExamTopResults } from "@/features/exams";
import { ClipboardListIcon, MousePointerClickIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { idCache } from "@/lib/nuqs/id";
import ExamResultsPage from "@/components/exams/exam-results-page";
import EmptyState from "@/components/ui/empty-state";
import { ExamMarksPage } from "@/components/exams/exam-marks-page";

export default async function page({ searchParams }: PageProps<"/exams">) {
  const { yearId, gradeId, classId, examId } = await idCache.parse(searchParams);

  const awaitedParams = await searchParams;
  const isViewing = awaitedParams.type === "view";

  const showClassSelect = !classId && !isViewing;
  const showExamSelect = classId || isViewing;
  const showGradeSelect = !gradeId;

  function renderEmptyStateContent() {
    if (showGradeSelect) {
      return (
        <EmptyState
          icon={MousePointerClickIcon}
          title="Select a Grade"
          description="Choose a Grade from left sidebar to see its classes."
        />
      );
    }

    if (gradeId) {
      {
        if (showClassSelect) {
          return (
            <EmptyState
              icon={MousePointerClickIcon}
              title="Select a class"
              description="Choose a class from the sidebar to view its exams."
            />
          );
        }
        if (showExamSelect) {
          return (
            <EmptyState
              icon={MousePointerClickIcon}
              title="Select an exam"
              description={`Choose an exam from the sidebar to ${isViewing ? "view student results" : "view/edit marks"}`}
            />
          );
        }
      }
    }
  }

  let examResults: IExamTopResults | null = null;
  let examDetails: IExamListItem | null = null;
  let examClassData: IExamClassData | null = null;

  try {
    if (examId) {
      examDetails = await examService.getListItemById(examId);
    }
    if (yearId && gradeId && examId) {
      examResults = await examService.getTopResults(yearId, gradeId, examId);
    }
    if (yearId && gradeId && classId && examId) {
      examClassData = await examService.getExamDataForClass(yearId, gradeId, classId, examId);
    }
  } catch {
    redirect("/exams", "replace");
  }

  return (
    <>
      {!examId && renderEmptyStateContent()}

      {examId && isViewing && examDetails && !examResults && (
        <EmptyState
          icon={ClipboardListIcon}
          title="No results available"
          description="There are no results available for this exam."
        />
      )}

      {examId && isViewing && examDetails && examResults && (
        <ExamResultsPage details={examDetails} results={examResults} />
      )}

      {examId && !isViewing && examClassData && (
        <ExamMarksPage examName={examDetails?.name ?? "Exam"} examData={examClassData} />
      )}
    </>
  );
}
