import "server-only";

import { prisma } from "@/lib/prisma";
import {
  EnrollmentCreateInput,
  EnrollmentSubjectUpdateInput,
  EnrollmentUpdateInput,
  EnrollmentWhereInput,
} from "@/generated/prisma/models";

export class EnrollmentRepository {
  async getById(id: string) {
    return await prisma.enrollment.findUnique({
      where: { id },
      include: {
        enrollmentSubjects: { include: { classSubject: { include: { subject: true } }, medium: true } },
        marks: { include: { examSubject: { include: { subject: true } } } },
        class: { include: { gradeLevel: { select: { academicYearId: true } } } },
      },
    });
  }

  async getId(classId: string, studentId: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { classId_studentId: { studentId, classId } },
      select: { id: true },
    });
    return enrollment?.id;
  }

  async getClassSubject(classId: string, subjectId: string) {
    return await prisma.classSubject.findUnique({
      where: { classId_subjectId: { classId, subjectId } },
      select: { id: true, mediumId: true },
    });
  }

  async getRelations(enrollmentId: string) {
    return await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: { marks: { select: { id: true } } },
    });
  }

  async getSubjectRelations(enrollmentId: string, subjectId: string) {
    return await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: {
        marks: {
          where: { examSubject: { subjectId } },
          select: { id: true },
        },
      },
    });
  }

  async create(data: EnrollmentCreateInput) {
    return await prisma.enrollment.create({ data });
  }

  async update(enrollmentId: string, data: EnrollmentUpdateInput) {
    return await prisma.enrollment.update({
      where: { id: enrollmentId },
      data,
    });
  }

  async updateMany(where: EnrollmentWhereInput, data: EnrollmentUpdateInput) {
    return await prisma.enrollment.updateMany({ where, data });
  }

  async createSubject(enrollmentId: string, classSubjectId: string, mediumId: string) {
    return await prisma.enrollmentSubject.create({
      data: {
        enrollment: { connect: { id: enrollmentId } },
        classSubject: { connect: { id: classSubjectId } },
        medium: { connect: { id: mediumId } },
      },
    });
  }

  async updateSubject(enrollmentId: string, classSubjectId: string, data: EnrollmentSubjectUpdateInput) {
    return await prisma.enrollmentSubject.update({
      where: { enrollmentId_classSubjectId: { enrollmentId, classSubjectId } },
      data,
    });
  }

  async deleteSubject(enrollmentId: string, classSubjectId: string) {
    return await prisma.enrollmentSubject.delete({
      where: { enrollmentId_classSubjectId: { enrollmentId, classSubjectId } },
    });
  }
}
