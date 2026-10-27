import "server-only";

import { prisma } from "@/lib/prisma";
import { studentEnrollmentSelect, studentListSelect, studentProfuileSelect, studentSelect } from "./students.types";
import { getCleanSearch, getPagination, IQueryParams } from "@/lib/filter";
import { StudentWhereInput } from "@/generated/prisma/models";
import { DOBFilter, GenderFilter } from "./student.cache";

export type IStudentProfileListFilters = IQueryParams & { gender: GenderFilter; dobFrom: DOBFilter; dobTo: DOBFilter };

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

  async getProfileList({ search, page, limit, gender, dobFrom, dobTo }: IStudentProfileListFilters) {
    const cleanSearch = getCleanSearch(search);
    const { limitNumber, skipCount } = getPagination({ page, limit });

    const where: StudentWhereInput = {};

    if (cleanSearch) {
      where.OR = [
        { admissionNo: { contains: cleanSearch } },
        { fullName: { contains: cleanSearch } },
        { nic: { contains: cleanSearch } },
        { phone: { contains: cleanSearch } },
        { address: { contains: cleanSearch } },
        { guardianName: { contains: cleanSearch } },
        { guardianPhone: { contains: cleanSearch } },
      ];
    }

    let genderWhere: StudentWhereInput = {};
    if (gender !== "all") {
      genderWhere = { gender: { equals: gender } };
    }

    let dobWhere: StudentWhereInput = {};
    if (dobFrom && dobTo) {
      dobWhere = { dob: { gte: dobFrom, lte: dobTo } };
    }

    return await Promise.all([
      prisma.student.count({ where: { ...where, ...genderWhere, ...dobWhere } }),
      prisma.student.findMany({
        where: { ...where, ...genderWhere, ...dobWhere },
        select: studentProfuileSelect,
        take: limitNumber,
        skip: skipCount,
        orderBy: { createdAt: "desc" },
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

  async getEnrollmentsById(studentId: string) {
    return await prisma.student.findUnique({
      where: { id: studentId },
      select: studentEnrollmentSelect,
    });
  }
}
