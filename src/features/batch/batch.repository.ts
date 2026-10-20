import { prisma } from "@/lib/prisma";
import { batchClassSelect, batchListSelect, IBatchListItem } from "./batch.types";
import { getCleanSearch, IQueryParams } from "@/lib/filter";
import { BatchWhereInput } from "@/generated/prisma/models";

export class BatchRepository {
  async getList({ search }: Pick<IQueryParams, "search">) {
    const cleanSearch = getCleanSearch(search);

    const where: BatchWhereInput = {};
    if (cleanSearch) {
      where.OR = [{ name: { contains: cleanSearch } }];
    }

    return await prisma.batch.findMany({
      where,
      select: batchListSelect,
      orderBy: { createdAt: "desc" },
    });
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
}
