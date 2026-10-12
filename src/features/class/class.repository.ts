import { prisma } from "@/lib/prisma";
import { classListSelect, IClassListItem } from "./class.types";

export class ClassRepository {
  async getList(yearId: string, gradeId: string): Promise<IClassListItem[]> {
    return await prisma.class.findMany({
      where: { academicYearId: yearId, gradeLevelId: gradeId },
      select: classListSelect,
    });
  }
}
