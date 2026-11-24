import "server-only";

import { BatchRepository } from "./batch.repository";
import { IBatch, IBatchListItem } from "./batch.types";
import { IQueryParams } from "@/lib/filter";
import { BatchType } from "@/generated/prisma/enums";
import { batchSchema } from "./batch.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { batchIdRequiredError, batchNameExistsError, batchNotFoundError, batchTypeRequiredError } from "./batch.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import z from "zod";

export class BatchService {
  constructor(private repository: BatchRepository) {}

  async getList({ search, type }: Pick<IQueryParams, "search"> & { type: BatchType }): Promise<IBatchListItem[]> {
    if (!type) throw new batchTypeRequiredError();
    return await this.repository.getList({ search, type });
  }

  async getListItemById(batchId: string): Promise<IBatchListItem> {
    if (!batchId) throw new batchIdRequiredError();
    const batch = await this.repository.getListItemById(batchId);
    if (!batch) throw new batchNotFoundError();
    return batch;
  }

  async getById(batchId: string): Promise<IBatch> {
    if (!batchId) throw new batchIdRequiredError();
    const batchData = await this.repository.getById(batchId);
    if (!batchData) throw new batchNotFoundError();

    const academicYearMap = new Map<string, IBatch["academicYears"][number]>();

    for (const grade of batchData.grades) {
      const { academicYear } = grade;

      if (!academicYearMap.has(academicYear.id)) {
        academicYearMap.set(academicYear.id, {
          ...academicYear,
          grades: [],
        });
      }

      academicYearMap.get(academicYear.id)!.grades.push({
        id: grade.id,
        name: grade.name,
        classCount: grade.classes.length,
      });
    }

    return {
      id: batchData.id,
      name: batchData.name,
      type: batchData.type,
      academicYears: [...academicYearMap.values()],
    };
  }

  async create(data: z.infer<typeof batchSchema>) {
    const parsedData = batchSchema.safeParse(data);
    if (!parsedData.success) {
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.create({
        name: parsedData.data.name.trim(),
        type: parsedData.data.type,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new batchNameExistsError();
        }
      }
      throw error;
    }
  }

  async update(batchId: string, data: z.infer<typeof batchSchema>) {
    if (!batchId) throw new batchIdRequiredError();

    const parsedData = batchSchema.safeParse(data);
    if (!parsedData.success) {
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.update(batchId, {
        name: parsedData.data.name.trim(),
        type: parsedData.data.type,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new batchNameExistsError();
        }
        if (error.code === "P2025") {
          throw new batchNotFoundError();
        }
      }
      throw error;
    }
  }

  async delete(batchId: string) {
    if (!batchId) throw new batchIdRequiredError();
    const batch = await this.repository.getById(batchId);
    if (!batch) throw new batchNotFoundError();

    if (batch.grades.length > 0) {
      throw new recordInUseError();
    }

    try {
      await this.repository.delete(batchId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new batchNotFoundError();
        }
        if (error.code === "P2003") {
          throw new recordInUseError();
        }
      }
      throw error;
    }
  }
}
