import { MediumRepository } from "./medium.repository";
import { IQueryParams } from "@/lib/filter";
import { IMediumListItem, IMediumOption } from "./medium.types";

export class MediumService {
  constructor(private repository: MediumRepository) {}

  async getList({ search }: Pick<IQueryParams, "search">): Promise<IMediumListItem[]> {
    return await this.repository.getList({ search });
  }

  async getAsOptions(): Promise<IMediumOption[]> {
    const mediumList = await this.repository.getList({});
    return mediumList.map((medium) => ({ value: medium.id, label: medium.name }));
  }
}
