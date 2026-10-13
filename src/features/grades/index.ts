import { GradesService } from "./grades.service";
import { GradesRepository } from "./grades.repository";

export const gradesRepository = new GradesRepository();
export const gradesService = new GradesService(gradesRepository);
export * from "./grades.types";
