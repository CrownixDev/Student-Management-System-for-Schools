import { IAcademicYear, IAcademicYearListItem } from "./year.types";
import { AcademicYearsRepository } from "./year.repository";
import { ApiError } from "@/lib/ApiError";
import { IQueryParams } from "@/lib/filter";

export class AcademicYearsService {
  constructor(private repository: AcademicYearsRepository) {}

  async getList({ search }: Pick<IQueryParams, "search">): Promise<IAcademicYear[]> {
    return await this.repository.getList({ search });
  }

  async getListItemById(yearId: string): Promise<IAcademicYearListItem> {
    const year = await this.repository.getListItemById(yearId);
    if (!year) throw new ApiError(404, "Year not found");
    return year;
  }
}
