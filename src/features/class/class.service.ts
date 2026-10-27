import "server-only";

import { ApiError } from "@/lib/ApiError";
import { ClassRepository } from "./class.repository";
import { IClass, IClassList, IClassOption } from "./class.types";

export class ClassService {
  constructor(private repository: ClassRepository) {}

  async getById(id: string): Promise<IClass> {
    if (!id) throw new ApiError(400, "Class id is required");
    const classData = await this.repository.getById(id);
    if (!classData) throw new ApiError(404, "Class Not Found");
    return {
      id: classData.id,
      name: classData.name,
      academicYear: classData.academicYear,
      gradeLevel: classData.gradeLevel,
      defaultMedium: classData.defaultMedium,
      classTeacher: classData.classTeacher,
      batch: classData.batch,
      enrollments: classData.enrollments,
      subjects: classData.classSubjects.map((sub) => ({
        id: sub.subject.id,
        name: sub.subject.name,
        code: sub.subject.code,
        category: sub.subject.category,
        medium: sub.medium,
        teacher: sub.teacher,
      })),
    };
  }

  async getList(yearId: string, gradeId: string): Promise<IClassList> {
    if (!yearId || !gradeId) throw new ApiError(400, "Year and grade ids are required");
    const classList = await this.repository.getList(yearId, gradeId);
    return classList.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      studentCount: classItem.enrollments.length,
    }));
  }

  async getAsOptions(yearId: string, gradeId: string): Promise<IClassOption[]> {
    if (!yearId || !gradeId) throw new ApiError(400, "Year and grade ids are required");
    const classList = await this.repository.getList(yearId, gradeId);
    return classList.map((item) => ({ value: item.id, label: item.name }));
  }
}
