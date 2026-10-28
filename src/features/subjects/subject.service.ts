import "server-only";

import { IQueryParams } from "@/lib/filter";
import { SubjectRepository } from "./subject.repository";
import { ISubject, ISubjectListItem } from "./subject.types";
import { SubjectCategory } from "@/generated/prisma/enums";
import { ApiErrorV2 } from "@/lib/ApiError";
import { subjectSchema } from "./subject.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import z from "zod";

export class SubjectService {
  constructor(private repository: SubjectRepository) {}

  async getListByEnrollmentId(enrollmentId: string): Promise<ISubjectListItem[]> {
    if (!enrollmentId) throw new ApiErrorV2("Enrollment id is required");
    return await this.repository.getListByEnrollmentId(enrollmentId);
  }

  async getList({
    search,
    category,
  }: {
    search: IQueryParams["search"];
    category: SubjectCategory;
  }): Promise<ISubjectListItem[]> {
    if (!category) throw new ApiErrorV2("Subject Category is required");
    return await this.repository.getList({ search, category });
  }

  async getById(subId: string): Promise<ISubject | null> {
    if (!subId) throw new ApiErrorV2("Subject id is required");
    return await this.repository.getById(subId);
  }

  async create(data: z.infer<typeof subjectSchema>) {
    const parsedData = subjectSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.create(parsedData.data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Subject code is already exists");
        }
      }
      throw error;
    }
  }

  async update(subjectId: string, data: z.infer<typeof subjectSchema>) {
    if (!subjectId) throw new ApiErrorV2("Subject id is required");

    const parsedData = subjectSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.update(subjectId, parsedData.data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Subject code is already exists");
        }
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async delete(subjectId: string) {
    if (!subjectId) throw new ApiErrorV2("Subject id is required");

    const subject = await this.repository.getRelations(subjectId);
    if (!subject) throw new ApiErrorV2("Subject not found");

    const hasRelations =
      subject.streams.length > 0 ||
      subject.classSubjects.length > 0 ||
      subject.enrollmentSubjects.length > 0 ||
      subject.examSubjects.length > 0 ||
      subject.marks.length > 0 ||
      subject.userSubjects.length > 0;

    if (hasRelations) {
      throw new ApiErrorV2("This subject is currently in use");
    }

    try {
      await this.repository.delete(subjectId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
        if (error.code === "P2003") {
          throw new ApiErrorV2("This Subject is currently in use");
        }
      }
      throw error;
    }
  }
}
