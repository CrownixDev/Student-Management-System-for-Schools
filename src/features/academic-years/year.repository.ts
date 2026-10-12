import { prisma } from "@/lib/prisma";
import { academicYearListSelect, IAcademicYearListItem } from "./year.types";

export class AcademicYearsRepository {
  async getList(): Promise<IAcademicYearListItem[]> {
    return await prisma.academicYear.findMany({
      select: academicYearListSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async getListItemById(yearId: string): Promise<IAcademicYearListItem | null> {
    return await prisma.academicYear.findUnique({
      where: { id: yearId },
      select: academicYearListSelect,
    });
  }
}
