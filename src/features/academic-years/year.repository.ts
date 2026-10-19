import { prisma } from "@/lib/prisma";
import { academicYearListSelect, academicYearSelect } from "./year.types";
import { getCleanSearch, IQueryParams } from "@/lib/filter";
import { AcademicYearWhereInput } from "@/generated/prisma/models";

export class AcademicYearsRepository {
  async getList({ search }: Pick<IQueryParams, "search">) {
    const cleanSearch = getCleanSearch(search);

    const where: AcademicYearWhereInput = {};

    if (cleanSearch) {
      where.OR = [{ name: { contains: cleanSearch } }];
    }

    return await prisma.academicYear.findMany({
      where,
      select: academicYearSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async getListItemById(yearId: string) {
    return await prisma.academicYear.findUnique({
      where: { id: yearId },
      select: academicYearListSelect,
    });
  }
}
