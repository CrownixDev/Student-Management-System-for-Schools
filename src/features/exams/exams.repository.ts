import { prisma } from "@/lib/prisma";
import { examListSelect, examSelect, IExamListItem } from "./exams.types";

export class ExamRepository {
  async getList(yearId: string, gradeId: string): Promise<IExamListItem[]> {
    return await prisma.exam.findMany({
      where: { academicYearId: yearId, gradeLevelId: gradeId },
      select: examListSelect,
    });
  }

  async getByEnrollmentId(enrollmentId: string) {
    return await prisma.exam.findMany({
      where: { marks: { some: { enrollmentId } } },
      select: examSelect,
    });
  }
}
