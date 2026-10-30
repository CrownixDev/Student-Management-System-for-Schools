import "server-only";

import { ApiErrorV2 } from "@/lib/ApiError";
import { ClassRepository } from "./class.repository";
import { IClass, IClassList, IClassOption } from "./class.types";
import { classDetailsSchema } from "./class.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "@/lib/prisma";
import z from "zod";

export class ClassService {
  constructor(private repository: ClassRepository) {}

  async getById(id: string): Promise<IClass> {
    if (!id) throw new ApiErrorV2("Class id is required");
    const classData = await this.repository.getById(id);
    if (!classData) throw new ApiErrorV2("Class Not Found");
    return {
      id: classData.id,
      name: classData.name,
      academicYear: classData.academicYear,
      gradeLevel: classData.gradeLevel,
      defaultMedium: classData.defaultMedium,
      classTeacher: classData.classTeacher,
      batch: classData.batch,
      enrollments: classData.enrollments,
      subjects: classData.classSubjects.map((sub) => ({
        id: sub.subject.id,
        name: sub.subject.name,
        code: sub.subject.code,
        category: sub.subject.category,
        medium: sub.medium,
        teacher: sub.teacher,
      })),
    };
  }

  async getList(yearId: string, gradeId: string): Promise<IClassList> {
    if (!yearId || !gradeId) throw new ApiErrorV2("Year and grade ids are required");
    const classList = await this.repository.getList(yearId, gradeId);
    return classList.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      studentCount: classItem.enrollments.length,
    }));
  }

  async getAsOptions(yearId: string, gradeId: string): Promise<IClassOption[]> {
    if (!yearId || !gradeId) throw new ApiErrorV2("Year and grade ids are required");
    const classList = await this.repository.getList(yearId, gradeId);
    return classList.map((item) => ({ value: item.id, label: item.name }));
  }

  async create(yearId: string, gradeId: string, data: z.infer<typeof classDetailsSchema>) {
    const parsedRes = classDetailsSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.create({
        name: parsedRes.data.name,
        academicYear: { connect: { id: yearId } },
        gradeLevel: { connect: { id: gradeId } },
        classTeacher: parsedRes.data.teacherId ? { connect: { id: parsedRes.data.teacherId } } : undefined,
        defaultMedium: parsedRes.data.mediumId ? { connect: { id: parsedRes.data.mediumId } } : undefined,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Class name is already exists");
        }
      }
      console.log(error);
      throw error;
    }
  }

  async updateDetails(classId: string, data: z.infer<typeof classDetailsSchema>) {
    if (!classId) throw new ApiErrorV2("Class id is required");

    const parsedRes = classDetailsSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.update(classId, {
        name: parsedRes.data.name,
        classTeacher: parsedRes.data.teacherId ? { connect: { id: parsedRes.data.teacherId } } : { disconnect: {} },
        defaultMedium: parsedRes.data.mediumId ? { connect: { id: parsedRes.data.mediumId } } : { disconnect: {} },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Class name is already exists");
        }
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async delete(classId: string) {
    if (!classId) throw new ApiErrorV2("Class id is required");

    const classItem = await this.repository.getRelations(classId);
    if (!classItem) throw new ApiErrorV2("Class not found");

    const hasRelations = classItem.enrollments.length > 0;

    if (hasRelations) {
      throw new ApiErrorV2("This class is currently in use");
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.userClass.deleteMany({ where: { classId } });
        await tx.classSubject.deleteMany({ where: { classId } });
        await tx.class.delete({ where: { id: classId } });
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
        if (error.code === "P2003") {
          throw new ApiErrorV2("This class is currently in use");
        }
      }
      throw error;
    }
  }
}
