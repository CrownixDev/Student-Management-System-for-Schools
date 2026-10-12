import { prisma } from "@/lib/prisma";
import { IStreamListItem, streamListSelect } from "./steam.types";

export class StreamRepository {
  async getList(): Promise<IStreamListItem[]> {
    return await prisma.stream.findMany({
      select: streamListSelect,
    });
  }
}
