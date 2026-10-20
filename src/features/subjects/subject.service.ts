import { IQueryParams } from "@/lib/filter";
import { SubjectRepository } from "./subject.repository";
import { ISubject, ISubjectListItem } from "./subject.types";
import { SubjectCategory } from "@/generated/prisma/enums";

export class SubjectService {
  constructor(private repository: SubjectRepository) {}

  async getListByEnrollmentId(enrollmentId: string): Promise<ISubjectListItem[]> {
    return await this.repository.getListByEnrollmentId(enrollmentId);
  }

  async getList({
    search,
    category,
  }: {
    search: IQueryParams["search"];
    category: SubjectCategory;
  }): Promise<ISubjectListItem[]> {
    return await this.repository.getList({ search, category });
  }

  async getById(subId: string): Promise<ISubject | null> {
    return await this.repository.getById(subId);
  }
}
