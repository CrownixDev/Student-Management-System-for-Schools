import "server-only";

import { prisma } from "@/lib/prisma";
import { examListSelect, examSelect } from "./exams.types";
import { ExamCreateInput, ExamUpdateInput } from "@/generated/prisma/models";
import { TransactionClient } from "@/generated/prisma/internal/prismaNamespace";

export class ExamRepository {
  private db(client?: TransactionClient) {
    return client ?? prisma;
  }

  async getList(gradeId: string) {
    return await prisma.exam.findMany({
      where: { gradeLevelId: gradeId },
      select: examListSelect,
      orderBy: { createdAt: "asc" },
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
      where: { examSubjects: { some: { marks: { some: { enrollmentId } } } } },
      select: examSelect,
    });
  }

  async getExamSubjectById(id: string) {
    return await prisma.examSubject.findUnique({
      where: { id },
      select: { examId: true, subjectId: true },
    });
  }

  async getExamSubjectsBySubjectIds(examId: string, subjectIds: string[]) {
    return await prisma.examSubject.findMany({
      where: { examId, subjectId: { in: subjectIds } },
      select: { id: true, subjectId: true },
    });
  }

  async getRelationsForExamSubject(examId: string, subjectId: string) {
    return await prisma.mark.findMany({
      where: { examSubject: { examId, subjectId } },
      select: { id: true },
    });
  }

  async getRelations(id: string) {
    return await prisma.exam.findUnique({
      where: { id },
      select: {
        examSubjects: { select: { id: true, marks: { select: { id: true } } } },
      },
    });
  }
  async create(data: ExamCreateInput) {
    return await prisma.exam.create({ data });
  }

  async update(id: string, data: ExamUpdateInput) {
    return await prisma.exam.update({ where: { id }, data });
  }

  async delete(id: string, client?: TransactionClient) {
    return await this.db(client).exam.delete({ where: { id } });
  }
}
