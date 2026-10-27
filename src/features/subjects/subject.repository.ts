import "server-only";

import { prisma } from "@/lib/prisma";
import { ISubject, ISubjectListItem, subjectListSelect, subjectSelect } from "./subject.types";
import { getCleanSearch, IQueryParams } from "@/lib/filter";
import { SubjectWhereInput } from "@/generated/prisma/models";
import { SubjectCategory } from "@/generated/prisma/enums";

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

  async getList({ search, category }: { search: IQueryParams["search"]; category: SubjectCategory }) {
    const cleanSearch = getCleanSearch(search);

    const where: SubjectWhereInput = {};

    if (cleanSearch) {
      where.OR = [{ name: { contains: cleanSearch } }, { code: { contains: cleanSearch } }];
    }

    return await prisma.subject.findMany({
      where: { ...where, category },
      select: subjectListSelect,
    });
  }

  async getById(subId: string): Promise<ISubject | null> {
    return await prisma.subject.findUnique({
      where: { id: subId },
      select: subjectSelect,
    });
  }
}
