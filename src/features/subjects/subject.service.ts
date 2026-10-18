import { IQueryParams } from "@/lib/filter";
import { SubjectRepository } from "./subject.repository";
import { ISubject, ISubjectList, ISubjectListItem } from "./subject.types";

export class SubjectService {
  constructor(private repository: SubjectRepository) {}

  async getListByEnrollmentId(enrollmentId: string): Promise<ISubjectListItem[]> {
    return await this.repository.getListByEnrollmentId(enrollmentId);
  }

  async getList({ search, page, limit }: IQueryParams): Promise<ISubjectList> {
    const [list, count] = await this.repository.getList({ search, page, limit });
    return { list, count };
  }

  async getById(subId: string): Promise<ISubject | null> {
    return await this.repository.getById(subId);
  }
}
