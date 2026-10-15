import { ApiError } from "@/lib/ApiError";
import { StudentsRepository } from "./students.repository";
import { IStudent, IStudentsListItem } from "./students.types";

export class StudentsService {
  constructor(private repository: StudentsRepository) {}

  async getSortedList(yearId: string, gradeId: string, classId: string): Promise<IStudentsListItem[]> {
    const itemList = await this.repository.getList(yearId, gradeId, classId);
    const sortedItemList = itemList.sort((a, b) => a.enrollments[0].classIndex - b.enrollments[0].classIndex);
    return sortedItemList;
  }

  async getById(studentId: string, yearId: string, gradeId: string, classId: string): Promise<IStudent> {
    const student = await this.repository.getById(studentId, yearId, gradeId, classId);
    if (!student) throw new ApiError(404, "Student not found");

    const enrollment = student.enrollments[0];
    const examsByName = new Map<string, IStudent["enrollment"]["exams"][number]>();

    for (const mark of enrollment.marks) {
      let exam = examsByName.get(mark.exam.name);
      if (!exam) {
        exam = { name: mark.exam.name, subjects: [] };
        examsByName.set(mark.exam.name, exam);
      }

      exam.subjects.push({
        id: mark.subject.id,
        name: mark.subject.name,
        result: {
          marks: mark.marks,
          status: mark.status,
        },
      });
    }

    return {
      id: student.id,
      admissionNo: student.admissionNo,
      fullName: student.fullName,
      dob: student.dob,
      gender: student.gender,
      nic: student.nic,
      phone: student.phone,
      address: student.address,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        classIndex: enrollment.classIndex,
        exams: Array.from(examsByName.values()),
      },
    };
  }
}
