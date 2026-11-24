import "server-only";

import { GradesRepository } from "./grades.repository";
import { IGradeListItem, IGradeListItemForYear, IGradeWithClassesItem } from "./grades.types";
import { IQueryParams } from "@/lib/filter";
import { gradeSchema } from "@/features/grades/grades.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { gradeIdRequiredError, gradeNameExistsError, gradeNotFoundError, yearIdRequiredError } from "./grades.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import z from "zod";

export class GradesService {
  constructor(private repository: GradesRepository) {}

  async getListByYear({
    search,
    yearId,
  }: Pick<IQueryParams, "search"> & { yearId: string }): Promise<IGradeListItemForYear[]> {
    if (!yearId) throw new yearIdRequiredError();

    const gradeData = await this.repository.getListByYear({ search, yearId });

    return gradeData
      .map((grade) => ({
        id: grade.id,
        name: grade.name,
        classCount: grade.classes.length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }

  async getListItemById(gradeId: string): Promise<IGradeListItem> {
    if (!gradeId) throw new gradeIdRequiredError();

    const grade = await this.repository.getListItemById(gradeId);
    if (!grade) throw new gradeNotFoundError();
    return grade;
  }

  async getListWithClasses(yearId: string): Promise<IGradeWithClassesItem[]> {
    if (!yearId) throw new yearIdRequiredError();

    const grades = await this.repository.getListWithClasses(yearId);
    return grades
      .map((grade) => ({
        id: grade.id,
        name: grade.name,
        academicYear: grade.academicYear,
        batch: grade.batch,
        classes: grade.classes.map((classItem) => ({
          id: classItem.id,
          name: classItem.name,
          studentCount: classItem.enrollments.length,
        })),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }

  async create(yearId: string, data: z.infer<typeof gradeSchema>) {
    const parsedRes = gradeSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.create({
        academicYear: { connect: { id: yearId } },
        name: parsedRes.data.name,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new gradeNameExistsError();
        }
      }
      throw error;
    }
  }

  async update(gradeId: string, data: z.infer<typeof gradeSchema>) {
    if (!gradeId) throw new gradeIdRequiredError();

    const parsedRes = gradeSchema.safeParse(data);
    if (!parsedRes.success) {
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.update(gradeId, {
        name: parsedRes.data.name,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new gradeNameExistsError();
        }
        if (error.code === "P2025") {
          throw new gradeNotFoundError();
        }
      }
      throw error;
    }
  }

  async delete(gradeId: string) {
    if (!gradeId) throw new gradeIdRequiredError();

    try {
      await this.repository.delete(gradeId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new gradeNotFoundError();
        }
        if (error.code === "P2003") {
          throw new recordInUseError();
        }
      }
      throw error;
    }
  }
}
