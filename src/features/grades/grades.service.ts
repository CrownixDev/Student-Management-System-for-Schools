import "server-only";

import { ApiErrorV2 } from "@/lib/ApiError";
import { GradesRepository } from "./grades.repository";
import { IGradeListItem, IGradeListItemForYear, IGradeWithClassesItem } from "./grades.types";
import { IQueryParams } from "@/lib/filter";
import { gradeSchema } from "@/features/grades/grades.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import z from "zod";

export class GradesService {
  constructor(private repository: GradesRepository) {}

  async getList({ search }: Pick<IQueryParams, "search">): Promise<IGradeListItem[]> {
    return await this.repository.getList({ search });
  }

  async getListByYear(yearId: string): Promise<IGradeListItemForYear[]> {
    if (!yearId) throw new ApiErrorV2("Year id is required");

    const gradeData = await this.repository.getListByYear(yearId);
    if (!gradeData) throw new ApiErrorV2("Invalid year id");

    return gradeData.map((grade) => ({
      id: grade.id,
      number: grade.number,
      name: grade.name,
      classCount: grade.classes.length,
    }));
  }

  async getListItemById(gradeId: string): Promise<IGradeListItem> {
    if (!gradeId) throw new ApiErrorV2("Grade id is required");

    const grade = await this.repository.getListItemById(gradeId);
    if (!grade) throw new ApiErrorV2("Grade Not Found");
    return grade;
  }

  async getListWithClasses(yearId: string): Promise<IGradeWithClassesItem[]> {
    if (!yearId) throw new ApiErrorV2("Year id is required");

    const grades = await this.repository.getListWithClasses(yearId);
    return grades.map((grade) => ({
      ...grade,
      classes: grade.classes.map((classItem) => ({
        id: classItem.id,
        name: classItem.name,
        batch: classItem.batch,
        studentCount: classItem.enrollments.length,
      })),
    }));
  }

  async create(data: z.infer<typeof gradeSchema>) {
    const parsedData = gradeSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.create(parsedData.data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Grade number is already exists");
        }
      }
      throw error;
    }
  }

  async update(gradeId: string, data: z.infer<typeof gradeSchema>) {
    if (!gradeId) throw new ApiErrorV2("Grade id is required");

    const parsedData = gradeSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.update(gradeId, parsedData.data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Grade number is already exists");
        }
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async delete(gradeId: string) {
    if (!gradeId) throw new ApiErrorV2("Grade id is required");

    try {
      await this.repository.delete(gradeId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
        if (error.code === "P2003") {
          throw new ApiErrorV2("This grade is currently in use");
        }
      }
      throw error;
    }
  }
}
