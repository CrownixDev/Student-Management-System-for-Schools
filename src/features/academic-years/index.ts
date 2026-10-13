import { AcademicYearsService } from "./year.service";
import { AcademicYearsRepository } from "./year.repository";

export const academicYearsRepository = new AcademicYearsRepository();
export const academicYearsService = new AcademicYearsService(academicYearsRepository);
export * from "./year.types";
