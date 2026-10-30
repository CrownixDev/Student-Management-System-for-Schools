import "server-only";

import { prisma } from "@/lib/prisma";
import { classSelect } from "./class.types";
import { ClassCreateInput, ClassUpdateInput } from "@/generated/prisma/models";

export class ClassRepository {
  async getById(id: string) {
    return await prisma.class.findUnique({
      where: { id },
      select: {
        ...classSelect,
        classSubjects: {
          select: {
            medium: { select: { id: true, name: true } },
            teacher: { select: { id: true, fullName: true } },
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
                category: true,
              },
            },
          },
        },
      },
    });
  }

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

  async getRelations(id: string) {
    return await prisma.class.findUnique({
      where: { id },
      select: {
        enrollments: { select: { id: true } },
      },
    });
  }

  async create(data: ClassCreateInput) {
    return await prisma.class.create({ data });
  }

  async update(id: string, data: ClassUpdateInput) {
    return await prisma.class.update({ where: { id }, data });
  }
}
