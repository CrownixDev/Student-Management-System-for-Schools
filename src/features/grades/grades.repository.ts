import "server-only";

import { prisma } from "@/lib/prisma";
import { gradeListSelect, gradesSelect } from "./grades.types";
import { getCleanSearch, IQueryParams } from "@/lib/filter";
import { GradeLevelCreateInput, GradeLevelUpdateInput, GradeLevelWhereInput } from "@/generated/prisma/models";

export class GradesRepository {
  async getListByYear({ search, yearId }: Pick<IQueryParams, "search"> & { yearId: string }) {
    const cleanSearch = getCleanSearch(search);

    const where: GradeLevelWhereInput = {};

    if (cleanSearch) {
      where.OR = [{ name: { contains: cleanSearch } }];
    }

    return await prisma.gradeLevel.findMany({
      where: { ...where, academicYearId: yearId },
      select: {
        ...gradeListSelect,
        classes: {
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
      where: { academicYearId: yearId, id: gradeId },
      select: {
        id: true,
        name: true,
        classes: {
          select: {
            id: true,
            name: true,
            enrollments: {
              select: {
                id: true,
                student: { select: { id: true, fullName: true, admissionNo: true } },
                enrollmentSubjects: {
                  select: {
                    classSubject: { select: { subject: { select: { id: true, name: true } } } },
                    medium: { select: { name: true } },
                  },
                },
                marks: {
                  where: { examSubject: { examId } },
                  select: {
                    marks: true,
                    status: true,
                    examSubject: {
                      select: {
                        subject: { select: { id: true, name: true } },
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
      where: { academicYearId: yearId },
      select: {
        ...gradesSelect,
        classes: {
          select: {
            ...gradesSelect.classes.select,
            enrollments: { select: { id: true } },
          },
        },
      },
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
