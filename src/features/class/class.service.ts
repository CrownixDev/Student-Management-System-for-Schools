import { ClassRepository } from "./class.repository";
import { IClassList } from "./class.types";

export class ClassService {
  constructor(private repository: ClassRepository) {}

  async getList(yearId: string, gradeId: string): Promise<IClassList> {
    const classList = await this.repository.getList(yearId, gradeId);
    return classList.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      studentCount: classItem.enrollments.length,
    }));
  }
}
