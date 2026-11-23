import "server-only";

import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { teacherIdRequiredError, teacherNotFoundError } from "./teachers.errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { ITeacher, ITeacherList } from "./teachers.types";
import { TeachersRepository } from "./teachers.repository";
import { teacherSchema } from "./teachers.schema";
import { IQueryParams } from "@/lib/filter";
import z from "zod";

export class TeachersService {
  constructor(private repository: TeachersRepository) {}

  async getList({ search, limit, page }: IQueryParams): Promise<ITeacherList> {
    const [list, count] = await this.repository.getList({ search, limit, page });
    return { list, count };
  }

  async getById(teacherId: string): Promise<ITeacher> {
    if (!teacherId) throw new teacherIdRequiredError();

    const teacher = await this.repository.getById(teacherId);
    if (!teacher) throw new teacherNotFoundError();
    return {
      id: teacher.id,
      fullName: teacher.fullName,
      phone: teacher.phone,
      isActive: teacher.isActive,
      classesAsClassTeacher: teacher.classesAsClassTeacher.map((clases) => ({
        id: clases.id,
        name: clases.name,
        gradeLevel: {
          id: clases.gradeLevel.id,
          name: clases.gradeLevel.name,
        },
        academicYear: {
          id: clases.gradeLevel.academicYear.id,
          name: clases.gradeLevel.academicYear.name,
        },
      })),
      subjects: teacher.classSubjects.map((sub) => ({
        name: sub.subject.name,
        medium: sub.medium?.name ?? null,
        class: sub.class.name,
      })),
    };
  }

  async create(data: z.infer<typeof teacherSchema>) {
    const parsedData = teacherSchema.safeParse(data);
    if (!parsedData.success) {
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.create(parsedData.data);
    } catch (error) {
      throw error;
    }
  }

  async update(teacherId: string, data: z.infer<typeof teacherSchema>) {
    if (!teacherId) throw new teacherIdRequiredError();

    const parsedData = teacherSchema.safeParse(data);
    if (!parsedData.success) {
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.update(teacherId, parsedData.data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new teacherNotFoundError();
        }
      }
      throw error;
    }
  }

  async delete(teacherId: string) {
    if (!teacherId) throw new teacherIdRequiredError();

    const teacher = await this.repository.getRelations(teacherId);
    if (!teacher) throw new teacherNotFoundError();

    const hasRelations = teacher.classSubjects.length > 0 || teacher.classesAsClassTeacher.length > 0;

    if (hasRelations) {
      throw new recordInUseError();
    }

    try {
      await this.repository.delete(teacherId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new teacherNotFoundError();
        }
        if (error.code === "P2003") {
          throw new recordInUseError();
        }
      }
      throw error;
    }
  }
}
