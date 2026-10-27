import { ApiError } from "@/lib/ApiError";
import { GradesRepository } from "./grades.repository";
import { IGradeListItem, IGradeListItemForYear, IGradeWithClassesItem } from "./grades.types";
import { IQueryParams } from "@/lib/filter";

export class GradesService {
  constructor(private repository: GradesRepository) {}

  async getList({ search }: Pick<IQueryParams, "search">): Promise<IGradeListItem[]> {
    return await this.repository.getList({ search });
  }

  async getListByYear(yearId: string): Promise<IGradeListItemForYear[]> {
    if (!yearId) throw new ApiError(400, "Year id is required");

    const gradeData = await this.repository.getListByYear(yearId);
    if (!gradeData) throw new ApiError(400, "Invalid year id");

    return gradeData.map((grade) => ({
      id: grade.id,
      number: grade.number,
      name: grade.name,
      classCount: grade.classes.length,
    }));
  }

  async getListItemById(gradeId: string): Promise<IGradeListItem> {
    if (!gradeId) throw new ApiError(400, "Grade id is required");

    const grade = await this.repository.getListItemById(gradeId);
    if (!grade) throw new ApiError(404, "Grade Not Found");
    return grade;
  }

  async getListWithClasses(yearId: string): Promise<IGradeWithClassesItem[]> {
    if (!yearId) throw new ApiError(400, "Year id is required");

    const grades = await this.repository.getListWithClasses(yearId);
    return grades.map((grade) => ({
      ...grade,
      classes: grade.classes.map((classItem) => ({
        id: classItem.id,
        name: classItem.name,
        batch: classItem.batch,
        studentCount: classItem.enrollments.length,
      })),
    }));
  }
}
