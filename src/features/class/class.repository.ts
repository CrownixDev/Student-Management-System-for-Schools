import "server-only";

import { prisma } from "@/lib/prisma";
import { classListItemSelect, classSelect } from "./class.types";
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
            enrollmentSubjects: { select: { id: true } },
          },
        },
      },
    });
  }

  async getSubjectsById(id: string) {
    return await prisma.class.findUnique({
      where: { id },
      select: {
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
            enrollmentSubjects: { select: { id: true } },
          },
        },
      },
    });
  }

  async getList(gradeId: string) {
    return await prisma.class.findMany({
      where: { gradeLevelId: gradeId },
      select: classListItemSelect,
      orderBy: { createdAt: "asc" },
    });
  }

  async getStudentsWithExamData(yearId: string, gradeId: string, classId: string, examId: string) {
    return await prisma.class.findUnique({
      where: { id: classId, gradeLevelId: gradeId, gradeLevel: { academicYearId: yearId } },
      select: {
        id: true,
        name: true,
        gradeLevel: {
          select: {
            id: true,
            name: true,
            academicYear: { select: { id: true, name: true } },
          },
        },
        enrollments: {
          select: {
            id: true,
            classIndex: true,
            student: { select: { id: true, admissionNo: true, fullName: true } },
            marks: {
              where: { examSubject: { examId } },
              select: {
                marks: true,
                status: true,
                examSubject: { select: { subject: { select: { id: true, name: true, code: true } } } },
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

  async getRelationsForClassSubject(classId: string, subjectId: string) {
    return await prisma.class.findUnique({
      where: { id: classId },
      select: {
        enrollments: {
          where: { enrollmentSubjects: { some: { classSubject: { subjectId } } } },
          select: { id: true, enrollmentSubjects: { select: { id: true } } },
        },
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
