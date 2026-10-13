import { ApiError } from "@/lib/ApiError";
import { GradesRepository } from "./grades.repository";
import { IGradeListItem, IGradeListItemForYear } from "./grades.types";

export class GradesService {
  constructor(private repository: GradesRepository) {}

  async getListByYear(yearId: string): Promise<IGradeListItemForYear[]> {
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
    const grade = await this.repository.getListItemById(gradeId);
    if (!grade) throw new ApiError(404, "Grade Not Found");
    return grade;
  }
}
