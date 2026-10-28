import "server-only";

import { prisma } from "@/lib/prisma";
import { gradeListSelect, gradesSelect } from "./grades.types";
import { getCleanSearch, IQueryParams } from "@/lib/filter";
import { GradeLevelCreateInput, GradeLevelUpdateInput, GradeLevelWhereInput } from "@/generated/prisma/models";

export class GradesRepository {
  async getList({ search }: Pick<IQueryParams, "search">) {
    const cleanSearch = getCleanSearch(search);

    const where: GradeLevelWhereInput = {};

    if (cleanSearch) {
      where.OR = [{ name: { contains: cleanSearch } }];
    }

    return await prisma.gradeLevel.findMany({
      where,
      select: gradeListSelect,
      orderBy: { number: "asc" },
    });
  }

  async getListByYear(yearId: string) {
    return await prisma.gradeLevel.findMany({
      select: {
        ...gradeListSelect,
        classes: {
          where: { academicYearId: yearId },
          select: { id: true },
        },
      },
    });
  }

  async getListItemById(gradeId: string) {
    return await prisma.gradeLevel.findUnique({
      where: { id: gradeId },
      select: gradeListSelect,
    });
  }

  async getAllStudentsWithResults(yearId: string, gradeId: string, examId: string) {
    return await prisma.gradeLevel.findUnique({
      where: { id: gradeId },
      select: {
        id: true,
        number: true,
        name: true,
        classes: {
          where: { academicYearId: yearId },
          select: {
            id: true,
            name: true,
            enrollments: {
              select: {
                id: true,
                student: { select: { id: true, fullName: true, admissionNo: true } },
                subjects: {
                  select: {
                    subject: { select: { id: true, name: true, ignoreRanking: true } },
                    medium: { select: { name: true } },
                  },
                },
                marks: {
                  where: { examId },
                  select: {
                    marks: true,
                    status: true,
                    subject: {
                      select: {
                        id: true,
                        name: true,
                        ignoreRanking: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getListWithClasses(yearId: string) {
    return await prisma.gradeLevel.findMany({
      select: {
        ...gradesSelect,
        classes: {
          select: {
            ...gradesSelect.classes.select,
            enrollments: { select: { id: true } },
          },
          where: { academicYearId: yearId },
        },
      },
      orderBy: { number: "asc" },
    });
  }

  async create(data: GradeLevelCreateInput) {
    return await prisma.gradeLevel.create({ data });
  }

  async update(id: string, data: GradeLevelUpdateInput) {
    return await prisma.gradeLevel.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.gradeLevel.delete({ where: { id } });
  }
}
