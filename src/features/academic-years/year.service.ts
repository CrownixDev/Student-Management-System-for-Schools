import { IAcademicYearListItem } from "./year.types";
import { AcademicYearsRepository } from "./year.repository";
import { ApiError } from "@/lib/ApiError";

export class AcademicYearsService {
  constructor(private repository: AcademicYearsRepository) {}

  async getListItemById(yearId: string): Promise<IAcademicYearListItem> {
    const year = await this.repository.getListItemById(yearId);
    if (!year) throw new ApiError(404, "Year not found");
    return year;
  }
}
