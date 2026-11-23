import "server-only";

import { IQueryParams } from "@/lib/filter";
import { SubjectRepository } from "./subject.repository";
import { ISubject, ISubjectListItem } from "./subject.types";
import { SubjectCategory } from "@/generated/prisma/enums";
import { subjectSchema } from "./subject.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import z from "zod";
import {
  enrollmentIdRequiredError,
  subjectCategoryRequiredError,
  subjectCodeExistsError,
  subjectIdRequiredError,
  subjectNotFoundError,
} from "./subject.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";

export class SubjectService {
  constructor(private repository: SubjectRepository) {}

  async getListByEnrollmentId(enrollmentId: string): Promise<ISubjectListItem[]> {
    if (!enrollmentId) throw new enrollmentIdRequiredError();
    return await this.repository.getListByEnrollmentId(enrollmentId);
  }

  async getList({
    search,
    category,
  }: {
    search: IQueryParams["search"];
    category: SubjectCategory;
  }): Promise<ISubjectListItem[]> {
    if (!category) throw new subjectCategoryRequiredError();
    return await this.repository.getList({ search, category });
  }

  async getById(subId: string): Promise<ISubject | null> {
    if (!subId) throw new subjectIdRequiredError();
    return await this.repository.getById(subId);
  }

  async create(data: z.infer<typeof subjectSchema>) {
    const parsedData = subjectSchema.safeParse(data);
    if (!parsedData.success) {
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.create({
        name: parsedData.data.name,
        category: parsedData.data.category,
        code: parsedData.data.code ? parsedData.data.code : null,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new subjectCodeExistsError();
        }
      }
      throw error;
    }
  }

  async update(subjectId: string, data: z.infer<typeof subjectSchema>) {
    if (!subjectId) throw new subjectIdRequiredError();

    const parsedData = subjectSchema.safeParse(data);
    if (!parsedData.success) {
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.update(subjectId, {
        name: parsedData.data.name,
        category: parsedData.data.category,
        code: parsedData.data.code ? parsedData.data.code : null,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new subjectCodeExistsError();
        }
        if (error.code === "P2025") {
          throw new subjectNotFoundError();
        }
      }
      throw error;
    }
  }

  async delete(subjectId: string) {
    if (!subjectId) throw new subjectIdRequiredError();

    const subject = await this.repository.getRelations(subjectId);
    if (!subject) throw new subjectNotFoundError();

    const hasRelations =
      subject.classSubjects.length > 0 || subject.examSubjects.length > 0 || subject.userSubjects.length > 0;

    if (hasRelations) {
      throw new recordInUseError();
    }

    try {
      await this.repository.delete(subjectId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new subjectNotFoundError();
        }
        if (error.code === "P2003") {
          throw new recordInUseError();
        }
      }
      throw error;
    }
  }
}
