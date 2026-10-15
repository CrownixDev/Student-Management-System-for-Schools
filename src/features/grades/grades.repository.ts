import { prisma } from "@/lib/prisma";
import { gradeListSelect, IGradeListItem } from "./grades.types";

export class GradesRepository {
  async getList(): Promise<IGradeListItem[]> {
    return await prisma.gradeLevel.findMany({
      select: gradeListSelect,
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

  async getListItemById(gradeId: string): Promise<IGradeListItem | null> {
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
}
