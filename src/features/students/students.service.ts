import "server-only";

import { ApiError } from "@/lib/ApiError";
import { IStudentProfileListFilters, StudentsRepository } from "./students.repository";
import { IStudent, IStudentEnrollment, IStudentList, IStudentsListItem } from "./students.types";
import { IQueryParams } from "@/lib/filter";

export class StudentsService {
  constructor(private repository: StudentsRepository) {}

  async getList({ search, page, limit }: IQueryParams): Promise<IStudentList> {
    const [count, list] = await this.repository.getList({ search, page, limit });
    return { count, list };
  }

  async getProfileList({ search, page, limit, gender, dobFrom, dobTo }: IStudentProfileListFilters) {
    const [count, list] = await this.repository.getProfileList({ search, page, limit, gender, dobFrom, dobTo });
    return { count, list };
  }

  async getListForClass(yearId: string, gradeId: string, classId: string): Promise<IStudentsListItem[]> {
    if (!yearId || !gradeId || !classId) throw new ApiError(400, "Year, grade and class ids are required");

    const itemList = await this.repository.getListForClass(yearId, gradeId, classId);
    const sortedItemList = itemList.sort((a, b) => a.enrollments[0].classIndex - b.enrollments[0].classIndex);
    return sortedItemList;
  }

  async getById(studentId: string, yearId: string, gradeId: string, classId: string): Promise<IStudent> {
    if (!yearId || !gradeId || !classId || !studentId) {
      throw new ApiError(400, "Year, grade, class and student ids are required");
    }

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
      status: student.status,
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        classIndex: enrollment.classIndex,
        exams: Array.from(examsByName.values()),
      },
    };
  }

  async getEnrollmentsById(studentId: string): Promise<IStudentEnrollment[]> {
    if (!studentId) throw new ApiError(400, "Student ID is required");
    const student = await this.repository.getEnrollmentsById(studentId);
    if (!student) throw new ApiError(404, "Student not found");
    return student.enrollments.map((en) => ({
      ...en,
      subjects: en.subjects.map((sub) => ({
        name: sub.subject.name,
        category: sub.subject.category,
        code: sub.subject.code,
        medium: sub.medium?.name ?? null,
      })),
    }));
  }
}
