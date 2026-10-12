import { StudentsRepository } from "./students.repository";
import { IStudentsListItem } from "./students.types";

export class StudentsService {
  constructor(private repository: StudentsRepository) {}

  async getSortedList(yearId: string, gradeId: string, classId: string): Promise<IStudentsListItem[]> {
    const itemList = await this.repository.getList(yearId, gradeId, classId);
    const sortedItemList = itemList.sort((a, b) => a.enrollments[0].classIndex - b.enrollments[0].classIndex);
    return sortedItemList;
  }
}
