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

  async getStudentsWithExamData(yearId: string, gradeId: string, classId: string, examId: string) {
    return await prisma.class.findUnique({
      where: { id: classId, academicYearId: yearId, gradeLevelId: gradeId },
      select: {
        id: true,
        name: true,
        gradeLevel: { select: { id: true, name: true } },
        academicYear: { select: { id: true, name: true } },
        enrollments: {
          select: {
            id: true,
            classIndex: true,
            student: { select: { id: true, admissionNo: true, fullName: true } },
            marks: {
              where: { examId },
              select: {
                marks: true,
                status: true,
                subject: { select: { id: true, name: true, code: true } },
              },
            },
          },
        },
      },
    });
  }
}
