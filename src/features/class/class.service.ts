import "server-only";

import { ApiErrorV2 } from "@/lib/ApiError";
import { ClassRepository } from "./class.repository";
import { IClass, IClassList, IClassOption } from "./class.types";
import { classDetailsSchema, classSubjectsSchema } from "./class.schema";
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
      teacher: classData.teacher,
      gradeLevel: classData.gradeLevel,
      enrollments: classData.enrollments,
      subjects: classData.classSubjects.map((sub) => ({
        id: sub.subject.id,
        name: sub.subject.name,
        code: sub.subject.code,
        category: sub.subject.category,
        medium: sub.medium,
        teacher: sub.teacher,
        studentCount: sub.enrollmentSubjects.length,
      })),
    };
  }

  async getSubjectsById(id: string): Promise<IClass["subjects"]> {
    if (!id) throw new ApiErrorV2("Class id is required");

    const classData = await this.repository.getSubjectsById(id);
    if (!classData) throw new ApiErrorV2("Class Not Found");

    return classData.classSubjects.map((sub) => ({
      id: sub.subject.id,
      name: sub.subject.name,
      code: sub.subject.code,
      category: sub.subject.category,
      medium: sub.medium,
      teacher: sub.teacher,
      studentCount: sub.enrollmentSubjects.length,
    }));
  }

  async getList(gradeId: string): Promise<IClassList> {
    if (!gradeId) throw new ApiErrorV2("Grade id is required");
    const classList = await this.repository.getList(gradeId);
    return classList.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      studentCount: classItem.enrollments.length,
    }));
  }

  async getAsOptions(gradeId: string): Promise<IClassOption[]> {
    if (!gradeId) throw new ApiErrorV2("Grade id is required");
    const classList = await this.repository.getList(gradeId);
    return classList.map((item) => ({ value: item.id, label: item.name }));
  }

  async create(gradeId: string, data: z.infer<typeof classDetailsSchema>) {
    const parsedRes = classDetailsSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.create({
        name: parsedRes.data.name,
        gradeLevel: { connect: { id: gradeId } },
        teacher: parsedRes.data.teacherId ? { connect: { id: parsedRes.data.teacherId } } : undefined,
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
        teacher: parsedRes.data.teacherId ? { connect: { id: parsedRes.data.teacherId } } : { disconnect: {} },
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

  async updateBatch(batchId: string | null, gradeId: string) {
    if (!gradeId) throw new ApiErrorV2("Grade id is required");

    try {
      await prisma.gradeLevel.updateMany({
        where: { id: gradeId },
        data: { batchId },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateSubjects(classId: string, data: z.infer<typeof classSubjectsSchema>) {
    if (!classId) {
      throw new ApiErrorV2("Class id is required");
    }

    const parsedData = classSubjectsSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }
    try {
      await this.repository.update(classId, {
        classSubjects: {
          // This is used to update=> if where clause matched for existing record and, create=> if where does not match any of records
          upsert: parsedData.data.map((csub) => {
            return {
              where: {
                classId_subjectId: { classId, subjectId: csub.subjectId },
              },
              update: {
                medium: { connect: { id: csub.mediumId } },
                teacher: csub.teacherId ? { connect: { id: csub.teacherId } } : { disconnect: {} },
              },
              create: {
                subject: { connect: { id: csub.subjectId } },
                medium: { connect: { id: csub.mediumId } },
                teacher: csub.teacherId ? { connect: { id: csub.teacherId } } : undefined,
              },
            };
          }),
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async deleteSubject(classId: string, subjectId: string) {
    if (!classId || !subjectId) throw new ApiErrorV2("Class Id and Subject Id are required");

    const classItem = await this.repository.getRelationsForClassSubject(classId, subjectId);
    if (!classItem) throw new ApiErrorV2("Class not found");

    // Do not delete the class subject if any of student doing it
    const hasRelations = classItem.enrollments.length > 0;
    if (hasRelations) {
      throw new ApiErrorV2("This Class Subject is currently in use");
    }

    try {
      await prisma.classSubject.delete({ where: { classId_subjectId: { classId, subjectId } } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
        if (error.code === "P2003") {
          throw new ApiErrorV2("This Class Subject is currently in use");
        }
      }
      throw error;
    }
  }
}
