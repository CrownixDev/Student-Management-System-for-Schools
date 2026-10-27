import "server-only";

import { prisma } from "@/lib/prisma";
import { examListSelect, examSelect } from "./exams.types";

export class ExamRepository {
  async getList(yearId: string, gradeId: string) {
    return await prisma.exam.findMany({
      where: { academicYearId: yearId, gradeLevelId: gradeId },
      select: examListSelect,
    });
  }

  async getListItemById(examId: string) {
    return await prisma.exam.findUnique({
      where: { id: examId },
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
