import { MediumWhereInput } from "@/generated/prisma/models";
import { getCleanSearch, IQueryParams } from "@/lib/filter";
import { prisma } from "@/lib/prisma";
import { mediumSelect } from "./medium.types";

export class MediumRepository {
  async getList({ search }: Pick<IQueryParams, "search">) {
    const cleanSearch = getCleanSearch(search);

    const where: MediumWhereInput = {};

    if (cleanSearch) {
      where.OR = [{ name: { contains: cleanSearch } }];
    }

    return await prisma.medium.findMany({
      where,
      select: mediumSelect,
    });
  }
}
