import { IQueryParams } from "@/lib/filter";
import { SubjectRepository } from "./subject.repository";
import { ISubject, ISubjectListItem } from "./subject.types";
import { SubjectCategory } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/ApiError";

export class SubjectService {
  constructor(private repository: SubjectRepository) {}

  async getListByEnrollmentId(enrollmentId: string): Promise<ISubjectListItem[]> {
    if (!enrollmentId) throw new ApiError(400, "Enrollment id is required");
    return await this.repository.getListByEnrollmentId(enrollmentId);
  }

  async getList({
    search,
    category,
  }: {
    search: IQueryParams["search"];
    category: SubjectCategory;
  }): Promise<ISubjectListItem[]> {
    if (!category) throw new ApiError(400, "Subject Category is required");
    return await this.repository.getList({ search, category });
  }

  async getById(subId: string): Promise<ISubject | null> {
    if (!subId) throw new ApiError(400, "Subject id is required");
    return await this.repository.getById(subId);
  }
}
