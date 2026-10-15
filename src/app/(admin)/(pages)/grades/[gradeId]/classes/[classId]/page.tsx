import EmptyState from "@/components/admin/empty-state";
import ClassSidebar from "@/components/classes/class-sidebar";
import StudentDetails from "@/components/classes/student-details";
import { examService } from "@/features/exams";
import { studentsService } from "@/features/students";
import { subjectRepository } from "@/features/subjects";
import { idCache } from "@/lib/nuqs/id";
import { TriangleAlertIcon, UsersRoundIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ClassPage({ params, searchParams }: PageProps<"/grades/[gradeId]/classes/[classId]">) {
  const { yearId, studentId } = await idCache.parse(searchParams);
  const { gradeId, classId } = await params;

  if (!yearId || !gradeId || !classId) {
    redirect("/");
  }

  let studentDetails = (
    <EmptyState
      icon={TriangleAlertIcon}
      title="Invalid student Id"
      description="Please click on a student from the list to view their details"
    />
  );

  const studentList = await studentsService.getSortedList(yearId, gradeId, classId);

  if (studentId) {
    const student = await studentsService.getById(studentId, yearId, gradeId, classId);
    if (student) {
      const examData = await examService.getDataByEnrollmentId(student.enrollment.id);
      const subjectList = await subjectRepository.getListByEnrollmentId(student.enrollment.id);
      {
        studentDetails = <StudentDetails student={student} examData={examData} subjectList={subjectList} />;
      }
    }
  }

  return (
    <div className="flex h-dvh">
      <ClassSidebar studentList={studentList} />
      <div className="flex-1 overflow-y-auto">
        {!studentId && (
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
