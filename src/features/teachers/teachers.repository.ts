import { prisma } from "@/lib/prisma";
import { ITeacher, ITeacherListItem, teacherListSelect, teacherSelect } from "./teachers.types";

export class TeachersRepository {
  async getList(): Promise<ITeacherListItem[]> {
    return await prisma.teacher.findMany({
      select: teacherListSelect,
    });
  }

  async getById(teacherId: string): Promise<ITeacher | null> {
    return await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: teacherSelect,
    });
  }
}
