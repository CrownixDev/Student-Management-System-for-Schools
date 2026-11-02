import "server-only";

import { ApiErrorV2 } from "@/lib/ApiError";
import { IStudentProfileListFilters, StudentsRepository } from "./students.repository";
import { IStudent, IStudentEnrollment, IStudentList, IStudentsListItem } from "./students.types";
import { IQueryParams } from "@/lib/filter";
import { studentSchema } from "./student.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import z from "zod";

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
    if (!yearId || !gradeId || !classId) throw new ApiErrorV2("Year, grade and class ids are required");

    const itemList = await this.repository.getListForClass(yearId, gradeId, classId);
    const sortedItemList = itemList.sort(
      (a, b) => (a.enrollments[0].classIndex ?? itemList.length) - (b.enrollments[0].classIndex ?? itemList.length),
    );
    return sortedItemList;
  }

  async getById(studentId: string, yearId: string, gradeId: string, classId: string): Promise<IStudent> {
    if (!yearId || !gradeId || !classId || !studentId) {
      throw new ApiErrorV2("Year, grade, class and student ids are required");
    }

    const student = await this.repository.getById(studentId, yearId, gradeId, classId);
    if (!student) throw new ApiErrorV2("Student not found");

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
    if (!studentId) throw new ApiErrorV2("Student ID is required");
    const student = await this.repository.getEnrollmentsById(studentId);
    if (!student) throw new ApiErrorV2("Student not found");
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

  async create(data: z.infer<typeof studentSchema>) {
    const parsedData = studentSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.create(parsedData.data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Admission number is already exists");
        }
      }
      throw error;
    }
  }

  async update(studentId: string, data: z.infer<typeof studentSchema>) {
    if (!studentId) throw new ApiErrorV2("Student id is required");

    const parsedData = studentSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.update(studentId, {
        ...parsedData.data,
        dob: parsedData.data.dob ? new Date(parsedData.data.dob) : undefined,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Admission number is already exists");
        }
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async delete(studentId: string) {
    if (!studentId) throw new ApiErrorV2("Student id is required");

    const student = await this.repository.getRelations(studentId);
    if (!student) throw new ApiErrorV2("Student not found");

    const hasRelations = student.enrollments.length > 0;

    if (hasRelations) {
      throw new ApiErrorV2("This student is currently in use");
    }

    try {
      await this.repository.delete(studentId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
        if (error.code === "P2003") {
          throw new ApiErrorV2("This Student is currently in use");
        }
      }
      throw error;
    }
  }
}
