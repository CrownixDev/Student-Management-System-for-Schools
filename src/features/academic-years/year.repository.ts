import "server-only";

import { prisma } from "@/lib/prisma";
import { academicYearSelect } from "./year.types";
import { getCleanSearch, IQueryParams } from "@/lib/filter";
import { AcademicYearCreateInput, AcademicYearUpdateInput, AcademicYearWhereInput } from "@/generated/prisma/models";
import { TransactionClient } from "@/generated/prisma/internal/prismaNamespace";

export class AcademicYearsRepository {
  private db(client?: TransactionClient) {
    return client ?? prisma;
  }

  async getList({ search }: Pick<IQueryParams, "search">) {
    const cleanSearch = getCleanSearch(search);

    const where: AcademicYearWhereInput = {};

    if (cleanSearch) {
      where.OR = [{ name: { contains: cleanSearch } }];
    }

    return await prisma.academicYear.findMany({
      where,
      select: academicYearSelect,
    });
  }

  async getListItemById(yearId: string) {
    return await prisma.academicYear.findUnique({
      where: { id: yearId },
      select: academicYearSelect,
    });
  }

  async getActiveYear() {
    return await prisma.academicYear.findFirst({
      where: { isCurrent: true },
      select: academicYearSelect,
    });
  }

  async create(data: AcademicYearCreateInput) {
    await prisma.academicYear.create({ data });
  }

  async update(id: string, data: AcademicYearUpdateInput, client?: TransactionClient) {
    await this.db(client).academicYear.update({ where: { id }, data });
  }

  async updateMany(where: AcademicYearWhereInput, data: AcademicYearUpdateInput, client?: TransactionClient) {
    await this.db(client).academicYear.updateMany({ where, data });
  }

  async delete(id: string) {
    await prisma.academicYear.delete({ where: { id } });
  }
}
