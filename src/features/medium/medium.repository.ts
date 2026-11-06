import "server-only";

import { MediumCreateInput, MediumUpdateInput, MediumWhereInput } from "@/generated/prisma/models";
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

  async getRelations(id: string) {
    return await prisma.medium.findUnique({
      where: { id },
      select: {
        classSubjects: { select: { id: true } },
        enrollmentSubjects: { select: { id: true } },
      },
    });
  }

  async create(data: MediumCreateInput) {
    return await prisma.medium.create({ data });
  }

  async update(id: string, data: MediumUpdateInput) {
    return await prisma.medium.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.medium.delete({ where: { id } });
  }
}
