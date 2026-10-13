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
}
