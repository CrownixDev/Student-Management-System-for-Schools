import "server-only";

import { prisma } from "@/lib/prisma";
import {
  EnrollmentCreateInput,
  EnrollmentCreateManyInput,
  EnrollmentSubjectUpdateInput,
  EnrollmentUpdateInput,
} from "@/generated/prisma/models";

export class EnrollmentRepository {
  async getById(id: string) {
    return await prisma.enrollment.findUnique({
      where: { id },
      include: {
        subjects: { include: { subject: true, medium: true } },
        marks: true,
        class: true,
      },
    });
  }

  async getId(studentId: string, academicYearId: string) {
    return await prisma.enrollment.findUnique({
      where: { studentId_academicYearId: { studentId, academicYearId } },
      select: { id: true },
    });
  }

  async getRelations(studentId: string, academicYearId: string) {
    return await prisma.enrollment.findUnique({
      where: { studentId_academicYearId: { studentId, academicYearId } },
      select: { marks: { select: { id: true } } },
    });
  }

  async getSubjectRelations(studentId: string, academicYearId: string, subjectId: string) {
    return await prisma.enrollment.findUnique({
      where: { studentId_academicYearId: { studentId, academicYearId } },
      select: {
        marks: {
          where: { subjectId },
          select: { id: true },
        },
      },
    });
  }

  async create(data: EnrollmentCreateInput) {
    return await prisma.enrollment.create({ data });
  }

  async update(studentId: string, academicYearId: string, data: EnrollmentUpdateInput) {
    return await prisma.enrollment.update({
      where: { studentId_academicYearId: { studentId, academicYearId } },
      data,
    });
  }

  async updateSubject(enrollmentId: string, subjectId: string, data: EnrollmentSubjectUpdateInput) {
    return await prisma.enrollmentSubject.update({
      where: { enrollmentId_subjectId: { enrollmentId, subjectId } },
      data,
    });
  }
}
