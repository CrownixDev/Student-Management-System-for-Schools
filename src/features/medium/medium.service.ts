import { IMediumItem } from "@/components/dialog/medium/medium-dialog";
import { MediumRepository } from "./medium.repository";
import { IQueryParams } from "@/lib/filter";

export class MediumService {
  constructor(private repository: MediumRepository) {}

  async getList({ search }: Pick<IQueryParams, "search">): Promise<IMediumItem[]> {
    return await this.repository.getList({ search });
  }
}
