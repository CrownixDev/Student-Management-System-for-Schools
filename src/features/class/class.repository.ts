import { prisma } from "@/lib/prisma";

export class ClassRepository {
  async getList(yearId: string, gradeId: string) {
    return await prisma.class.findMany({
      where: { academicYearId: yearId, gradeLevelId: gradeId },
      select: {
        id: true,
        name: true,
        enrollments: {
          where: { academicYearId: yearId },
          select: { id: true },
        },
      },
    });
  }
}
