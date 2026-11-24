import "server-only";

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
import { IStudentProfileListFilters, StudentsRepository } from "./students.repository";
import { studentJsonFieldSchema, studentSchema } from "./student.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { InputJsonValue, JsonObject } from "@/generated/prisma/internal/prismaNamespace";
import { IQueryParams } from "@/lib/filter";
import { prisma } from "@/lib/prisma";
import {
  admissionNumberExistsError,
  changeDateToTextError,
  changeTextToDateError,
  classAndStudentIdRequiredError,
  classIdRequiredError,
  customFieldIdRequiredError,
  customFieldNameExistsError,
  customFieldNotFoundError,
  studentIdRequiredError,
  studentNotFoundError,
} from "./student.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
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
    if (!classId) throw new classIdRequiredError();

    const itemList = await this.repository.getListForClass(classId);
    const sortedItemList = itemList.sort(
      (a, b) => (a.enrollments[0].classIndex ?? itemList.length) - (b.enrollments[0].classIndex ?? itemList.length),
    );
    return sortedItemList;
  }

  async getProfileListForClass(classId: string): Promise<IStudentProfile[]> {
    if (!classId) throw new classIdRequiredError();

    const itemList = await this.repository.getProfileListForClass(classId);
    const sortedItemList = itemList.sort(
      (a, b) => (a.enrollments[0].classIndex ?? itemList.length) - (b.enrollments[0].classIndex ?? itemList.length),
    );
    return sortedItemList;
  }

  async getListForClassWithSubjects(classId: string): Promise<IStudentsListWithSubjectsItem[]> {
    if (!classId) throw new classIdRequiredError();

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
      throw new classAndStudentIdRequiredError();
    }

    const student = await this.repository.getById(classId, studentId);
    if (!student) throw new studentNotFoundError();

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
    if (!studentId) throw new studentIdRequiredError();
    const student = await this.repository.getEnrollmentsById(studentId);
    if (!student) throw new studentNotFoundError();

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
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.create({
        ...parsedData.data,
        dob: parsedData.data.dob ? new Date(parsedData.data.dob) : undefined,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new admissionNumberExistsError();
        }
      }
      throw error;
    }
  }

  async update(studentId: string, data: z.infer<typeof studentSchema>) {
    if (!studentId) throw new studentIdRequiredError();

    const parsedData = studentSchema.safeParse(data);
    if (!parsedData.success) {
      throw new invalidDataProvidedError();
    }

    const newJsonObj: Record<string, InputJsonValue> = {};
    Object.entries(parsedData.data.json ?? {}).map(([key, value]) => {
      newJsonObj[key] = value ? value : null;
    });

    try {
      await this.repository.update(studentId, {
        ...parsedData.data,
        dob: parsedData.data.dob ? new Date(parsedData.data.dob) : undefined,
        json: newJsonObj,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new admissionNumberExistsError();
        }
        if (error.code === "P2025") {
          throw new studentNotFoundError();
        }
      }
      throw error;
    }
  }

  async delete(studentId: string) {
    if (!studentId) throw new studentIdRequiredError();

    const student = await this.repository.getRelations(studentId);
    if (!student) throw new studentNotFoundError();

    const hasRelations = student.enrollments.length > 0;

    if (hasRelations) {
      throw new recordInUseError();
    }

    try {
      await this.repository.delete(studentId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new studentNotFoundError();
        }
        if (error.code === "P2003") {
          throw new recordInUseError();
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
      throw new invalidDataProvidedError();
    }

    const existing = await this.repository.getJsonFieldByName(parsedData.data.name);
    if (existing) {
      throw new customFieldNameExistsError();
    }

    try {
      await this.repository.createJsonField(parsedData.data);
    } catch (error) {
      throw error;
    }
  }

  async updateJsonField(id: string, data: z.infer<typeof studentJsonFieldSchema>) {
    if (!id) throw new customFieldIdRequiredError();
    const parsedData = studentJsonFieldSchema.safeParse(data);
    if (!parsedData.success) {
      throw new invalidDataProvidedError();
    }

    const current = await this.repository.getJsonFieldById(id);
    if (!current) {
      throw new customFieldNotFoundError();
    }
    if (current.type === "date" && (parsedData.data.type === "text" || parsedData.data.type === "bigText")) {
      throw new changeDateToTextError();
    }
    if (current.type !== "date" && parsedData.data.type === "date") {
      throw new changeTextToDateError();
    }

    const existing = await this.repository.getJsonFieldByName(parsedData.data.name);
    if (existing && existing.id !== id) {
      throw new customFieldNameExistsError();
    }

    try {
      await this.repository.updateJsonField(id, {
        name: parsedData.data.name,
        type: parsedData.data.type,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new customFieldNotFoundError();
        }
      }
      throw error;
    }
  }

  async deleteJsonField(id: string) {
    if (!id) throw new customFieldIdRequiredError();

    const current = await this.repository.getJsonFieldById(id);
    if (!current) {
      throw new customFieldNotFoundError();
    }

    const relations = await this.repository.getRelationsForJsonField(current.name);

    const hasRelations = relations.filter((item) => (item.json as JsonObject)?.[current.name] !== null).length > 0;
    if (hasRelations) {
      throw new recordInUseError();
    }

    const updateManyList = relations.map((rel) => {
      // Removing the custom field from all the students
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [current.name]: _we_dont_need_you, ...updatedObj } = rel.json as JsonObject;

      return prisma.student.updateMany({
        where: { id: rel.id },
        data: { json: updatedObj },
      });
    });

    prisma.$transaction(updateManyList);

    try {
      await this.repository.deleteJsonField(id);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new customFieldNotFoundError();
        }
        if (error.code === "P2003") {
          throw new recordInUseError();
        }
      }
      throw error;
    }
  }
}
