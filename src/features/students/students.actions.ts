"use server";

import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IStudentDetailsData } from "@/components/pages/exams/student-details-view-button";
import { subjectRepository } from "../subjects";
import { studentsService } from ".";
import { examService } from "../exams";
import { IResponse } from "@/lib/types";

export async function getStudentDetailsAction(
  studentId: string,
  classId: string,
): Promise<IResponse<IStudentDetailsData>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const student = await studentsService.getById(classId, studentId);
    const [examData, subjectList] = await Promise.all([
      examService.getDataByEnrollmentId(student.enrollment.id),
      subjectRepository.getListByEnrollmentId(student.enrollment.id),
    ]);
    return { success: true, data: { student, examData, subjectList } };
  } catch (error) {
    console.error("Error fetching data for student details:", error);
    return { success: false, message: "Failed to fetch data for student details" };
  }
}
