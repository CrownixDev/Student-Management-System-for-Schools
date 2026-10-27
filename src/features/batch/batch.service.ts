import "server-only";

import { ApiError } from "@/lib/ApiError";
import { BatchRepository } from "./batch.repository";
import { IBatch, IBatchList, IBatchListItem } from "./batch.types";
import { IQueryParams } from "@/lib/filter";
import { BatchType } from "@/generated/prisma/enums";

export class BatchService {
  constructor(private repository: BatchRepository) {}

  async getList({ search, page, limit, type }: IQueryParams & { type: BatchType }): Promise<IBatchList> {
    if (!type) throw new ApiError(400, "Batch type is required");
    const [count, list] = await this.repository.getList({ search, page, limit, type });
    return { count, list };
  }

  async getById(batchId: string): Promise<IBatch> {
    if (!batchId) throw new ApiError(400, "Batch id is required");
    const batchData = await this.repository.getById(batchId);

    if (!batchData) throw new ApiError(404, "Batch not found");

    const academicYears = new Map<string, IBatch["academicYear"][number]>();

    for (const schoolClass of batchData.classes) {
      let academicYear = academicYears.get(schoolClass.academicYear.id);

      if (!academicYear) {
        academicYear = {
          ...schoolClass.academicYear,
          grades: [],
        };
        academicYears.set(academicYear.id, academicYear);
      }

      const grade = academicYear.grades.find((item) => item.id === schoolClass.gradeLevel.id);

      if (grade) {
        grade.classCount += 1;
      } else {
        academicYear.grades.push({
          ...schoolClass.gradeLevel,
          classCount: 1,
        });
      }
    }

    return {
      id: batchData.id,
      name: batchData.name,
      type: batchData.type,
      academicYear: [...academicYears.values()],
    };
  }

  async getListItemById(batchId: string): Promise<IBatchListItem> {
    if (!batchId) throw new ApiError(400, "Batch id is required");
    const batch = await this.repository.getListItemById(batchId);
    if (!batch) throw new ApiError(404, "Batch Not Found");
    return batch;
  }
}
