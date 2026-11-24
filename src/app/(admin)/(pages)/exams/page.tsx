import { IStudentsListWithSubjectsItem } from "@/features/students";
import { IExamClassData, IExamListItem, IExamSubject } from "@/features/exams";
import { IAcademicYear } from "@/features/academic-years";
import { MousePointerClickIcon } from "lucide-react";
import { IClass } from "@/features/class";
import { ExamMarksPage } from "@/components/pages/exams/exam-marks-page";
import { redirect } from "next/navigation";
import { idCache } from "@/lib/nuqs/id";
import { getServerCaller } from "@/lib/orpc/server-caller";
import ExamResultsPage from "@/components/pages/exams/exam-results-page";
import EmptyState from "@/components/ui/empty-state";

export default async function page({ searchParams }: PageProps<"/exams">) {
  const caller = await getServerCaller();
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

  let activeYear: IAcademicYear | null = null;
  let examDetails: IExamListItem | null = null;
  let examDataForClass: IExamClassData | null = null;
  let studentsWithEnrolledSubjects: IStudentsListWithSubjectsItem[] | null = null;
  let classSubjects: IClass["subjects"] | null = null;
  let examSubjects: IExamSubject[] | null = null;

  try {
    if (examId) {
      examDetails = await caller.exam.getListItemById({ examId });
    }

    if (yearId && gradeId && classId && examId) {
      activeYear = await caller.academicYear.getActiveYear();
      examDataForClass = await caller.exam.getExamDataForClass({ classId, examId });
      studentsWithEnrolledSubjects = await caller.student.getListForClassWithSubjects({ classId });
      classSubjects = await caller.class.getSubjectsById({ id: classId });
      examSubjects = await caller.exam.getExamSubjects({ examId });
    }
  } catch {
    redirect("/exams", "replace");
  }

  return (
    <>
      {!examId && renderEmptyStateContent()}

      {examId && isViewing && examDetails && <ExamResultsPage exam={examDetails} />}

      {examId &&
        !isViewing &&
        examDetails &&
        examDataForClass &&
        studentsWithEnrolledSubjects &&
        classSubjects &&
        examSubjects && (
          <ExamMarksPage
            key={examId}
            exam={examDetails}
            examData={examDataForClass}
            studentsWithSubjects={studentsWithEnrolledSubjects}
            classSubjects={classSubjects}
            examSubjects={examSubjects}
            canEdit={activeYear?.id === examDetails.gradeLevel.academicYear.id}
          />
        )}
    </>
  );
}
