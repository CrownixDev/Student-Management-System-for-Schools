import "server-only";

import { prisma } from "@/lib/prisma";
import {
  studentEnrollmentSelect,
  studentListSelect,
  studentListWithSubjectsSelect,
  studentProfuileSelect,
  studentSelect,
} from "./students.types";
import { getCleanSearch, getPagination, IQueryParams } from "@/lib/filter";
import { StudentCreateInput, StudentUpdateInput, StudentWhereInput } from "@/generated/prisma/models";
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

  async getListForClass(classId: string) {
    return await prisma.student.findMany({
      where: { enrollments: { some: { class: { id: classId } } } },
      select: {
        ...studentListSelect,
        enrollments: {
          where: { class: { id: classId } },
          select: { classIndex: true },
        },
      },
    });
  }

  async getProfileListForClass(classId: string) {
    return await prisma.student.findMany({
      where: { enrollments: { some: { class: { id: classId } } } },
      select: {
        ...studentProfuileSelect,
        enrollments: {
          where: { class: { id: classId } },
          select: { classIndex: true },
        },
      },
    });
  }

  async getListForClassWithSubjects(classId: string) {
    return await prisma.student.findMany({
      where: { enrollments: { some: { class: { id: classId } } } },
      select: {
        ...studentListWithSubjectsSelect,
        enrollments: {
          where: { class: { id: classId } },
          ...studentListWithSubjectsSelect.enrollments,
        },
      },
    });
  }

  async getById(classId: string, studentId: string) {
    return await prisma.student.findUnique({
      where: {
        id: studentId,
        enrollments: { some: { class: { id: classId } } },
      },
      select: {
        ...studentSelect,
        enrollments: {
          where: { class: { id: classId } },
          ...studentSelect.enrollments,
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

  async getRelations(id: string) {
    return await prisma.student.findUnique({
      where: { id },
      select: {
        enrollments: { select: { id: true } },
      },
    });
  }

  async create(data: StudentCreateInput) {
    return await prisma.student.create({ data });
  }

  async update(id: string, data: StudentUpdateInput) {
    return await prisma.student.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.student.delete({ where: { id } });
  }
}
