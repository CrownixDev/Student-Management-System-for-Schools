import { examService, IExamByEnrollmentId } from "@/features/exams";
import { ISubjectListItem } from "@/features/subjects";
import { IStudent, studentsService } from "@/features/students";
import { classService, IClass } from "@/features/class";
import { UsersRoundIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { idCache } from "@/lib/nuqs/id";
import StudentDetails from "@/components/pages/classes/student-details";
import ClassSidebar from "@/components/pages/classes/class-sidebar";
import EmptyState from "@/components/ui/empty-state";
import { getServerCaller } from "@/lib/orpc/server-caller";

export default async function ClassPage({ params, searchParams }: PageProps<"/grades/[gradeId]/classes/[classId]">) {
  const caller = await getServerCaller();
  const { yearId, studentId } = await idCache.parse(searchParams);
  const { gradeId, classId } = await params;

  if (!yearId || !gradeId || !classId) {
    redirect("/");
  }

  let studentDetails = null;

  let classData: IClass | null = null;
  let student: IStudent | null = null;
  let examData: IExamByEnrollmentId[] | null = null;
  let subjectList: ISubjectListItem[] | null = null;

  try {
    classData = await classService.getById(classId);
    if (studentId) {
      student = await studentsService.getById(classId, studentId);
      if (student) {
        examData = await examService.getDataByEnrollmentId(student.enrollment.id);
        subjectList = await caller.subject.getListByEnrollmentId({ id: student.enrollment.id });
      }
    }
  } catch {
    console.log("No student found for given ID");
    redirect(`/grades/${gradeId}/classes/${classId}?yearId=${yearId}`);
  }

  if (student && examData && subjectList) {
    studentDetails = <StudentDetails student={student} examData={examData} subjectList={subjectList} />;
  }

  return (
    <div className="flex h-dvh">
      <ClassSidebar classData={classData} />
      <div className="flex-1 overflow-y-auto bg-sidebar/25">
        {!studentId && !studentDetails && (
          <EmptyState
            title="Select a student"
            description="Choose a student from the list to view their profile and exam results"
            icon={UsersRoundIcon}
          />
        )}
        {studentDetails}
      </div>
    </div>
  );
}
