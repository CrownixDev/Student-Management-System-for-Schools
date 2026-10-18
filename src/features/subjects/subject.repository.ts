import { prisma } from "@/lib/prisma";
import { ISubject, ISubjectListItem, subjectListSelect, subjectSelect } from "./subject.types";
import { getCleanSearch, getPagination, IQueryParams } from "@/lib/filter";
import { SubjectWhereInput } from "@/generated/prisma/models";

export class SubjectRepository {
  async getListByEnrollmentId(enrollmentId: string): Promise<ISubjectListItem[]> {
    return await prisma.subject.findMany({
      where: {
        enrollmentSubjects: {
          some: { enrollmentId },
        },
      },
      select: subjectListSelect,
    });
  }

  async getList({ search, page, limit }: IQueryParams) {
    const { limitNumber, skipCount } = getPagination({ page, limit });
    const cleanSearch = getCleanSearch(search);

    const where: SubjectWhereInput = {};

    if (cleanSearch) {
      where.OR = [{ name: { contains: cleanSearch }, code: { contains: cleanSearch } }];
    }

    return await Promise.all([
      prisma.subject.findMany({
        where,
        select: subjectListSelect,
        skip: skipCount,
        take: limitNumber,
      }),
      prisma.subject.count({ where }),
    ]);
  }

  async getById(subId: string): Promise<ISubject | null> {
    return await prisma.subject.findUnique({
      where: { id: subId },
      select: subjectSelect,
    });
  }
}
