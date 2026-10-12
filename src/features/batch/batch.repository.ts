import { prisma } from "@/lib/prisma";
import { batchListSelect, IBatchListItem } from "./batch.types";

export class BatchRepository {
  async getList(): Promise<IBatchListItem[]> {
    return await prisma.batch.findMany({
      select: batchListSelect,
      orderBy: { createdAt: "desc" },
    });
  }
}
