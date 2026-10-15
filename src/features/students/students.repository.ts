import { prisma } from "@/lib/prisma";
import { IStudentsListItem, studentListSelect, studentSelect } from "./students.types";

export class StudentsRepository {
  async getList(yearId: string, gradeId: string, classId: string): Promise<IStudentsListItem[]> {
    return await prisma.student.findMany({
      where: {
        enrollments: {
          some: {
            academicYearId: yearId,
            class: { id: classId, gradeLevelId: gradeId },
          },
        },
      },
      select: {
        ...studentListSelect,
        enrollments: {
          where: { academicYearId: yearId, class: { id: classId, gradeLevelId: gradeId } },
          select: { classIndex: true },
        },
      },
    });
  }

  async getById(studentId: string, yearId: string, gradeId: string, classId: string) {
    return await prisma.student.findUnique({
      where: {
        id: studentId,
        enrollments: {
          some: {
            academicYearId: yearId,
            class: { id: classId, gradeLevelId: gradeId },
          },
        },
      },
      select: {
        ...studentSelect,
        enrollments: {
          ...studentSelect.enrollments,
          where: {
            academicYearId: yearId,
            class: { id: classId, gradeLevelId: gradeId },
          },
        },
      },
    });
  }
}
