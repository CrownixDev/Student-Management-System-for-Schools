import "server-only";

import {
  activeYearNotFoundError,
  invalidDataProvidedError,
  yearIdRequiredError,
  yearNameAlreadyExistError,
  yearNotFoundError,
  yearUsingByOthersError,
} from "./year.errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { AcademicYearsRepository } from "./year.repository";
import { academicYearSchema } from "./year.schema";
import { IAcademicYear } from "./year.types";
import { IQueryParams } from "@/lib/filter";
import { prisma } from "@/lib/prisma";
import z from "zod";

export class AcademicYearsService {
  constructor(private repository: AcademicYearsRepository) {}

  async getList({ search }: Pick<IQueryParams, "search">): Promise<IAcademicYear[]> {
    return (await this.repository.getList({ search })).sort((a, b) =>
      b.name.localeCompare(a.name, undefined, { numeric: true }),
    );
  }

  async getListItemById(yearId: string): Promise<IAcademicYear> {
    if (!yearId) throw new yearIdRequiredError();
    const year = await this.repository.getListItemById(yearId);
    if (!year) throw new yearNotFoundError();
    return year;
  }

  async getActiveYear(): Promise<IAcademicYear> {
    const year = await this.repository.getActiveYear();
    if (!year) throw new activeYearNotFoundError();
    return year;
  }

  async create(data: z.infer<typeof academicYearSchema>) {
    const result = z.safeParse(academicYearSchema, data);
    if (!result.success) throw new invalidDataProvidedError();

    try {
      await this.repository.create({
        name: result.data.name.trim(),
        startDate: new Date(result.data.startDate),
        endDate: new Date(result.data.endDate),
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new yearNameAlreadyExistError();
        }
      }
      throw error;
    }
  }

  async update(yearId: string, data: z.infer<typeof academicYearSchema>) {
    if (!yearId) throw new yearIdRequiredError();
    const result = z.safeParse(academicYearSchema, data);
    if (!result.success) throw new invalidDataProvidedError();

    try {
      await this.repository.update(yearId, {
        name: result.data.name.trim(),
        startDate: new Date(result.data.startDate),
        endDate: new Date(result.data.endDate),
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new yearNameAlreadyExistError();
        }
      }
      throw error;
    }
  }

  async setAsCurrent(yearId: string) {
    if (!yearId) throw new yearIdRequiredError();
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
    if (!yearId) throw new yearIdRequiredError();
    try {
      await this.repository.delete(yearId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new yearUsingByOthersError();
        }
      }
      throw error;
    }
  }
}
