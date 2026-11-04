import "server-only";

import { ApiErrorV2 } from "@/lib/ApiError";
import { BatchRepository } from "./batch.repository";
import { IBatch, IBatchList, IBatchListItem } from "./batch.types";
import { IQueryParams } from "@/lib/filter";
import { BatchType } from "@/generated/prisma/enums";
import { batchSchema } from "./batch.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import z from "zod";

export class BatchService {
  constructor(private repository: BatchRepository) {}

  async getList({ search, page, limit, type }: IQueryParams & { type: BatchType }): Promise<IBatchList> {
    if (!type) throw new ApiErrorV2("Batch type is required");
    const [count, list] = await this.repository.getList({ search, page, limit, type });
    return { count, list };
  }

  async getListItemById(batchId: string): Promise<IBatchListItem> {
    if (!batchId) throw new ApiErrorV2("Batch id is required");
    const batch = await this.repository.getListItemById(batchId);
    if (!batch) throw new ApiErrorV2("Batch Not Found");
    return batch;
  }

  async getById(batchId: string): Promise<IBatch> {
    if (!batchId) throw new ApiErrorV2("Batch id is required");
    const batchData = await this.repository.getById(batchId);
    if (!batchData) throw new ApiErrorV2("Batch not found");

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
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.create({
        name: parsedData.data.name.trim(),
        type: parsedData.data.type,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Batch name is already exists");
        }
      }
      throw error;
    }
  }

  async update(batchId: string, data: z.infer<typeof batchSchema>) {
    if (!batchId) throw new ApiErrorV2("Batch id is required");

    const parsedData = batchSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.update(batchId, {
        name: parsedData.data.name.trim(),
        type: parsedData.data.type,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Batch name is already exists");
        }
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async delete(batchId: string) {
    if (!batchId) throw new ApiErrorV2("Batch id is required");
    const batch = await this.repository.getById(batchId);
    if (!batch) throw new ApiErrorV2("Batch not found");

    if (batch.grades.length > 0) {
      throw new ApiErrorV2("This Batch is currently in use");
    }

    try {
      await this.repository.delete(batchId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
        if (error.code === "P2003") {
          throw new ApiErrorV2("This Batch is currently in use");
        }
      }
      throw error;
    }
  }
}
