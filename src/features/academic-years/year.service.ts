import "server-only";

import { IAcademicYear } from "./year.types";
import { AcademicYearsRepository } from "./year.repository";
import { ApiErrorV2 } from "@/lib/ApiError";
import { IQueryParams } from "@/lib/filter";
import { academicYearSchema } from "./year.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "@/lib/prisma";
import z from "zod";

export class AcademicYearsService {
  constructor(private repository: AcademicYearsRepository) {}

  async getList({ search }: Pick<IQueryParams, "search">): Promise<IAcademicYear[]> {
    return await this.repository.getList({ search });
  }

  async getListItemById(yearId: string): Promise<IAcademicYear> {
    if (!yearId) throw new ApiErrorV2("Year is is required");
    const year = await this.repository.getListItemById(yearId);
    if (!year) throw new ApiErrorV2("Year not found");
    return year;
  }

  async getActiveYear(): Promise<IAcademicYear> {
    const year = await this.repository.getActiveYear();
    if (!year) throw new ApiErrorV2("No active years found");
    return year;
  }

  async create(data: z.infer<typeof academicYearSchema>) {
    const result = z.safeParse(academicYearSchema, data);
    if (!result.success) throw new ApiErrorV2("Invalid data provided");

    try {
      await this.repository.create({
        name: result.data.name.trim(),
        startDate: new Date(result.data.startDate),
        endDate: new Date(result.data.endDate),
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Name already exists");
        }
      }
      throw error;
    }
  }

  async update(yearId: string, data: z.infer<typeof academicYearSchema>) {
    if (!yearId) throw new ApiErrorV2("Year id is required");
    const result = z.safeParse(academicYearSchema, data);
    if (!result.success) throw new ApiErrorV2("Invalid data provided");

    try {
      await this.repository.update(yearId, {
        name: result.data.name.trim(),
        startDate: new Date(result.data.startDate),
        endDate: new Date(result.data.endDate),
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Name already exists");
        }
      }
      throw error;
    }
  }

  async setAsCurrent(yearId: string) {
    if (!yearId) throw new ApiErrorV2("Year id is required");
    try {
      // Only one academic year should be active no matter what
      await prisma.$transaction(async (transaction) => {
        await this.repository.updateMany({ isCurrent: true }, { isCurrent: false }, transaction);
        await this.repository.update(yearId, { isCurrent: true }, transaction);
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(yearId: string) {
    if (!yearId) throw new ApiErrorV2("Year id is required");
    try {
      await this.repository.delete(yearId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new ApiErrorV2("This year is using my many records");
        }
      }
      throw error;
    }
  }
}
