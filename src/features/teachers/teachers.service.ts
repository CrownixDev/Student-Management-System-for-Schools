import { IQueryParams } from "@/lib/filter";
import { ApiError } from "@/lib/ApiError";
import { TeachersRepository } from "./teachers.repository";
import { ITeacher, ITeacherList } from "./teachers.types";

export class TeachersService {
  constructor(private repository: TeachersRepository) {}

  async getList({ search, limit, page }: IQueryParams): Promise<ITeacherList> {
    const [list, count] = await this.repository.getList({ search, limit, page });
    return { list, count };
  }

  async getById(teacherId: string): Promise<ITeacher> {
    const teacher = await this.repository.getById(teacherId);
    if (!teacher) throw new ApiError(404, "Teacher Not Found");
    return {
      ...teacher,
      subjects: teacher.classSubjects.map((sub) => ({
        name: sub.subject.name,
        medium: sub.medium?.name ?? null,
        class: sub.class.name,
      })),
    };
  }
}
