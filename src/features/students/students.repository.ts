import { prisma } from "@/lib/prisma";
import { studentListSelect, studentSelect } from "./students.types";
import { getCleanSearch, getPagination, IQueryParams } from "@/lib/filter";
import { StudentWhereInput } from "@/generated/prisma/models";

export class StudentsRepository {
  async getList({ search, page, limit }: IQueryParams) {
    const cleanSearch = getCleanSearch(search);
    const { limitNumber, skipCount } = getPagination({ page, limit });

    const where: StudentWhereInput = {};

    if (cleanSearch) {
      where.OR = [
        { admissionNo: { contains: cleanSearch } },
        { fullName: { contains: cleanSearch } },
        { dob: { equals: cleanSearch } },
        { nic: { contains: cleanSearch } },
        { phone: { contains: cleanSearch } },
        { address: { contains: cleanSearch } },
        { guardianName: { contains: cleanSearch } },
        { guardianPhone: { contains: cleanSearch } },
      ];
    }

    return await Promise.all([
      prisma.student.count({ where: { status: "active", ...where } }),
      prisma.student.findMany({
        where: { status: "active", ...where },
        select: studentListSelect,
        take: limitNumber,
        skip: skipCount,
      }),
    ]);
  }

  async getListForClass(yearId: string, gradeId: string, classId: string) {
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
