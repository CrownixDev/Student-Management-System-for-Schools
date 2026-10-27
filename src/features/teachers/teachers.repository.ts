import "server-only";

import { prisma } from "@/lib/prisma";
import { teacherListSelect, teacherSelect } from "./teachers.types";
import { getCleanSearch, getPagination, IQueryParams } from "@/lib/filter";
import { TeacherWhereInput } from "@/generated/prisma/models";

export class TeachersRepository {
  async getList({ search, limit, page }: IQueryParams) {
    const { limitNumber, skipCount } = getPagination({ page, limit });
    const cleanSearch = getCleanSearch(search);

    const where: TeacherWhereInput = {};
    if (cleanSearch) {
      where.OR = [{ fullName: { contains: cleanSearch } }, { phone: { contains: cleanSearch } }];
    }

    return await Promise.all([
      prisma.teacher.findMany({
        where,
        select: teacherListSelect,
        take: limitNumber,
        skip: skipCount,
      }),
      prisma.teacher.count({ where }),
    ]);
  }

  async getById(teacherId: string) {
    return await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: teacherSelect,
    });
  }
}
