import { prisma } from "@/lib/prisma";
import { batchClassSelect, batchListSelect, IBatchListItem } from "./batch.types";

export class BatchRepository {
  async getList(): Promise<IBatchListItem[]> {
    return await prisma.batch.findMany({
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
