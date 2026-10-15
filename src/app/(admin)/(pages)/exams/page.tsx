import EmptyState from "@/components/admin/empty-state";
import { examService, IExamListItem, IExamTopResults } from "@/features/exams";
import { idCache } from "@/lib/nuqs/id";
import { ClipboardListIcon, MousePointerClickIcon } from "lucide-react";
import { redirect } from "next/navigation";
import ExamResults from "./exam-results";

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

  try {
    if (examId) examDetails = await examService.getListItemById(examId);
    if (yearId && gradeId && examId) examResults = await examService.getTopResults(yearId, gradeId, examId);
  } catch {
    redirect("/exams", "replace");
  }

  return (
    <>
      {!examId && renderEmptyStateContent()}
      {examId && isViewing && examDetails && examResults && <ExamResults details={examDetails} results={examResults} />}
      {examId && isViewing && examDetails && !examResults && (
        <EmptyState
          icon={ClipboardListIcon}
          title="No results available"
          description="There are no results available for this exam."
        />
      )}
      {examId && !isViewing && <div>View/Edit marks ${examId}</div>}
    </>
  );
}
