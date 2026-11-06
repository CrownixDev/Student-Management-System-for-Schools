import "server-only";

import { prisma } from "@/lib/prisma";
import { ISubject, ISubjectListItem, subjectListSelect, subjectSelect } from "./subject.types";
import { getCleanSearch, IQueryParams } from "@/lib/filter";
import { SubjectCreateInput, SubjectUpdateInput, SubjectWhereInput } from "@/generated/prisma/models";
import { SubjectCategory } from "@/generated/prisma/enums";

export class SubjectRepository {
  async getListByEnrollmentId(enrollmentId: string): Promise<ISubjectListItem[]> {
    return await prisma.subject.findMany({
      where: {
        classSubjects: {
          some: {
            enrollmentSubjects: {
              some: { enrollmentId },
            },
          },
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

  async getRelations(id: string) {
    return await prisma.subject.findUnique({
      where: { id },
      select: {
        classSubjects: { select: { id: true } },
        examSubjects: { select: { id: true } },
        userSubjects: { select: { id: true } },
      },
    });
  }

  async create(data: SubjectCreateInput) {
    return await prisma.subject.create({ data });
  }

  async update(id: string, data: SubjectUpdateInput) {
    return await prisma.subject.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.subject.delete({ where: { id } });
  }
}
