import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";
import { examService } from "@/features/exams";
import { studentsService } from "@/features/students";
import { subjectRepository } from "@/features/subjects";
import { ExternalLinkIcon } from "lucide-react";
import { redirect } from "next/navigation";
import StudentDetails from "@/components/classes/student-details";

export default async function StudentDetailsViewButton({
  studentId,
  yearId,
  gradeId,
  classId,
}: {
  studentId: string;
  yearId: string;
  gradeId: string;
  classId: string;
}) {
  const details = await getStudentDetails(studentId, yearId, gradeId, classId);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="secondary">
            View
            <ExternalLinkIcon />
          </Button>
        }
      />
      <SheetContent
        className={"min-w-3xl"}
        render={
          <StudentDetails student={details.student} examData={details.examData} subjectList={details.subjectList} />
        }
      />
    </Sheet>
  );
}

async function getStudentDetails(studentId: string, yearId: string, gradeId: string, classId: string) {
  try {
    const student = await studentsService.getById(studentId, yearId, gradeId, classId);
    const examData = await examService.getDataByEnrollmentId(student.enrollment.id);
    const subjectList = await subjectRepository.getListByEnrollmentId(student.enrollment.id);
    return { student, examData, subjectList };
  } catch {
    redirect("/exams", "replace");
  }
}
