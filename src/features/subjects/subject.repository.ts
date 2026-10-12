import { prisma } from "@/lib/prisma";
import { ISubject, ISubjectListItem, subjectListSelect, subjectSelect } from "./subject.types";

export class SubjectRepository {
  async getListByEnrollmentId(enrollmentId: string): Promise<ISubjectListItem[]> {
    return await prisma.subject.findMany({
      where: {
        enrollmentSubjects: {
          some: { enrollmentId },
        },
      },
      select: subjectListSelect,
    });
  }

  async getList(): Promise<ISubjectListItem[]> {
    return await prisma.subject.findMany({
      select: subjectListSelect,
    });
  }

  async getById(subId: string): Promise<ISubject | null> {
    return await prisma.subject.findUnique({
      where: { id: subId },
      select: subjectSelect,
    });
  }
}
