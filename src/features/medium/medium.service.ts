import { MediumRepository } from "./medium.repository";
import { IQueryParams } from "@/lib/filter";
import { IMediumListItem } from "./medium.types";

export class MediumService {
  constructor(private repository: MediumRepository) {}

  async getList({ search }: Pick<IQueryParams, "search">): Promise<IMediumListItem[]> {
    return await this.repository.getList({ search });
  }
}
