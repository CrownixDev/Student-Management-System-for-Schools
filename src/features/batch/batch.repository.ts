import "server-only";

import { prisma } from "@/lib/prisma";
import { batchClassSelect, batchListSelect, IBatchListItem } from "./batch.types";
import { getCleanSearch, getPagination, IQueryParams } from "@/lib/filter";
import { BatchCreateInput, BatchUpdateInput, BatchWhereInput } from "@/generated/prisma/models";
import { BatchType } from "@/generated/prisma/enums";

export class BatchRepository {
  async getList({ search, page, limit, type }: IQueryParams & { type: BatchType }) {
    const cleanSearch = getCleanSearch(search);
    const { skipCount, limitNumber } = getPagination({ page, limit });

    const where: BatchWhereInput = {};
    if (cleanSearch) {
      where.OR = [{ name: { contains: cleanSearch } }];
    }

    return await Promise.all([
      prisma.batch.count({
        where: { ...where, type },
      }),
      prisma.batch.findMany({
        where: { ...where, type },
        select: batchListSelect,
        orderBy: { createdAt: "desc" },
        take: limitNumber,
        skip: skipCount,
      }),
    ]);
  }

  async getListItemById(batchId: string): Promise<IBatchListItem | null> {
    return await prisma.batch.findUnique({
      where: { id: batchId },
      select: batchListSelect,
    });
  }

  async getById(batchId: string) {
    return await prisma.batch.findUnique({
      where: { id: batchId },
      select: {
        ...batchListSelect,
        classes: { select: batchClassSelect },
      },
    });
  }

  async create(data: BatchCreateInput) {
    return await prisma.batch.create({ data });
  }

  async update(id: string, data: BatchUpdateInput) {
    return await prisma.batch.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.batch.delete({ where: { id } });
  }
}
