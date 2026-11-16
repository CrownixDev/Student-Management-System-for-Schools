import "server-only";

import { ApiErrorV2 } from "@/lib/ApiError";
import { IStudentProfileListFilters, StudentsRepository } from "./students.repository";
import {
  IStudent,
  IStudentEnrollment,
  IStudentJsonField,
  IStudentList,
  IStudentProfile,
  IStudentProfileList,
  IStudentsListItem,
  IStudentsListWithSubjectsItem,
} from "./students.types";
import { IQueryParams } from "@/lib/filter";
import { studentJsonFieldSchema, studentSchema } from "./student.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import z from "zod";

export class StudentsService {
  constructor(private repository: StudentsRepository) {}

  async getList({ search, page, limit }: IQueryParams): Promise<IStudentList> {
    const [count, list] = await this.repository.getList({ search, page, limit });
    return { count, list };
  }

  async getProfileList({
    search,
    page,
    limit,
    gender,
    dobFrom,
    dobTo,
  }: IStudentProfileListFilters): Promise<IStudentProfileList> {
    const [count, list] = await this.repository.getProfileList({ search, page, limit, gender, dobFrom, dobTo });
    return { count, list };
  }

  async getListForClass(classId: string): Promise<IStudentsListItem[]> {
    if (!classId) throw new ApiErrorV2("Class id is required");

    const itemList = await this.repository.getListForClass(classId);
    const sortedItemList = itemList.sort(
      (a, b) => (a.enrollments[0].classIndex ?? itemList.length) - (b.enrollments[0].classIndex ?? itemList.length),
    );
    return sortedItemList;
  }

  async getProfileListForClass(classId: string): Promise<IStudentProfile[]> {
    if (!classId) throw new ApiErrorV2("Class id is required");

    const itemList = await this.repository.getProfileListForClass(classId);
    const sortedItemList = itemList.sort(
      (a, b) => (a.enrollments[0].classIndex ?? itemList.length) - (b.enrollments[0].classIndex ?? itemList.length),
    );
    return sortedItemList;
  }

  async getListForClassWithSubjects(classId: string): Promise<IStudentsListWithSubjectsItem[]> {
    if (!classId) throw new ApiErrorV2("Year, grade and class ids are required");

    const itemList = await this.repository.getListForClassWithSubjects(classId);
    const sortedItemList = itemList.sort(
      (a, b) => (a.enrollments[0].classIndex ?? itemList.length) - (b.enrollments[0].classIndex ?? itemList.length),
    );
    return sortedItemList.map((st) => ({
      id: st.id,
      admissionNo: st.admissionNo,
      fullName: st.fullName,
      enrollment: {
        classIndex: st.enrollments[0].classIndex,
        subjects: st.enrollments[0].enrollmentSubjects.map((esub) => ({
          subjectId: esub.classSubject.subject.id,
          mediumId: esub.medium.id,
        })),
      },
    }));
  }

  async getById(classId: string, studentId: string): Promise<IStudent> {
    if (!classId || !studentId) {
      throw new ApiErrorV2("Class and student ids are required");
    }

    const student = await this.repository.getById(classId, studentId);
    if (!student) throw new ApiErrorV2("Student not found");

    const enrollment = student.enrollments[0];
    const examsByName = new Map<string, IStudent["enrollment"]["exams"][number]>();

    for (const mark of enrollment.marks) {
      let exam = examsByName.get(mark.examSubject.exam.name);

      if (!exam) {
        exam = { name: mark.examSubject.exam.name, subjects: [] };
        examsByName.set(mark.examSubject.exam.name, exam);
      }

      exam.subjects.push({
        id: mark.examSubject.subject.id,
        name: mark.examSubject.subject.name,
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
      json: student.json,
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
      id: en.id,
      status: en.status,
      classIndex: en.classIndex,
      joinedOn: en.joinedOn,
      endedOn: en.endedOn,
      academicYear: {
        id: en.class.gradeLevel.academicYear.id,
        name: en.class.gradeLevel.academicYear.name,
      },
      class: {
        id: en.class.id,
        name: en.class.name,
        gradeLevel: {
          id: en.class.gradeLevel.id,
          name: en.class.gradeLevel.name,
        },
      },
      subjects: en.enrollmentSubjects.map((esub) => ({
        name: esub.classSubject.subject.name,
        category: esub.classSubject.subject.category,
        code: esub.classSubject.subject.code,
        medium: esub.medium?.name ?? null,
      })),
    }));
  }

  async create(data: z.infer<typeof studentSchema>) {
    const parsedData = studentSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.create({
        ...parsedData.data,
        dob: parsedData.data.dob ? new Date(parsedData.data.dob) : undefined,
      });
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

  async getJsonFields(): Promise<IStudentJsonField[]> {
    return await this.repository.getJsonFields();
  }

  async createJsonField(data: z.infer<typeof studentJsonFieldSchema>) {
    const parsedData = studentJsonFieldSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    const existing = await this.repository.getJsonFieldByName(parsedData.data.name);
    if (existing) {
      throw new ApiErrorV2("A custom field with this name already exists");
    }

    try {
      await this.repository.createJsonField(parsedData.data);
    } catch (error) {
      throw error;
    }
  }

  async updateJsonField(id: string, data: z.infer<typeof studentJsonFieldSchema>) {
    if (!id) throw new ApiErrorV2("Field id is required");
    const parsedData = studentJsonFieldSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    const current = await this.repository.getJsonFieldById(id);
    if (!current) {
      throw new ApiErrorV2("Record not found");
    }
    if (current.type === "date" && (parsedData.data.type === "text" || parsedData.data.type === "bigText")) {
      throw new ApiErrorV2("You cannot change the type of a date field to text field");
    }
    if (current.type !== "date" && parsedData.data.type === "date") {
      throw new ApiErrorV2("You cannot change the type of a text field to date field");
    }

    const existing = await this.repository.getJsonFieldByName(parsedData.data.name);
    if (existing && existing.id !== id) {
      throw new ApiErrorV2("A custom field with this name already exists");
    }

    try {
      await this.repository.updateJsonField(id, parsedData.data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }
}
